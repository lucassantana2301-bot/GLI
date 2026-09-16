/**
 * Web Audio API Sound Synthesizer for Volkswagen Jetta GLI (EA888 2.0 TSI)
 * Creates real-time procedural exhaust rumble, turbo spool, and DSG upshift pops
 */

class GLIEngineAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.oscillators = [];
    this.noiseNode = null;
    this.filterNode = null;
    this.rpm = 800; // Idle RPM
    this.targetRpm = 800;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Fade in master volume safely
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.01, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.8);

    // 1. Primary Low-End Rumble Oscillator (4-cylinder firing rate)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(32, now); // ~960 RPM idle frequency

    // 2. Second Harmonic Sub Oscillator
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(64, now);

    // 3. Exhaust Tone Lowpass Filter
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(260, now);
    this.filterNode.Q.setValueAtTime(3.0, now);

    // Connect oscillators to filter and gain
    this.osc1.connect(this.filterNode);
    this.osc2.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);

    this.osc1.start(now);
    this.osc2.start(now);

    this.oscillators = [this.osc1, this.osc2];
    this.updateStatusUI(true);
  }

  stop() {
    if (!this.isPlaying) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      this.isPlaying = false;
      this.updateStatusUI(false);
    }, 500);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  // Play a full Launch Control Acceleration Run (0-100 km/h)
  launchControlRun() {
    this.start();
    const now = this.ctx.currentTime;

    // Step 1: Rev to 3,500 RPM (Launch Staging with 2-step limiter pops)
    this.setRpm(3500, now + 0.4, 0.8);

    // Staging pops
    setTimeout(() => this.triggerDsgPop(0.7), 400);
    setTimeout(() => this.triggerDsgPop(0.8), 800);

    // Step 2: Launch! 1st gear pull to 6,200 RPM
    setTimeout(() => {
      if (!this.isPlaying) return;
      const t1 = this.ctx.currentTime;
      this.setRpm(6200, t1, 1.2);
    }, 1200);

    // Step 3: DSG Shift 1st -> 2nd with Pop
    setTimeout(() => {
      if (!this.isPlaying) return;
      this.triggerDsgPop(1.0);
      const t2 = this.ctx.currentTime;
      this.setRpm(3800, t2, 0.1);
      this.setRpm(6300, t2 + 0.1, 1.6);
    }, 2400);

    // Step 4: DSG Shift 2nd -> 3rd (Passing 100 km/h)
    setTimeout(() => {
      if (!this.isPlaying) return;
      this.triggerDsgPop(1.0);
      const t3 = this.ctx.currentTime;
      this.setRpm(4200, t3, 0.1);
      this.setRpm(5600, t3 + 0.1, 1.8);
    }, 4000);

    // Return to idle
    setTimeout(() => {
      if (!this.isPlaying) return;
      const t4 = this.ctx.currentTime;
      this.setRpm(900, t4, 1.5);
    }, 6000);
  }

  setRpm(targetRpm, startTime, duration) {
    if (!this.isPlaying || !this.osc1) return;
    const baseFreq = (targetRpm / 60) * 2; // 4-cylinder engine 2 pulses per rev
    this.osc1.frequency.cancelScheduledValues(startTime);
    this.osc1.frequency.exponentialRampToValueAtTime(Math.max(20, baseFreq), startTime + duration);

    this.osc2.frequency.cancelScheduledValues(startTime);
    this.osc2.frequency.exponentialRampToValueAtTime(Math.max(40, baseFreq * 2), startTime + duration);

    // Adjust filter cutoff with RPM
    const cutoff = 200 + (targetRpm / 6500) * 1200;
    this.filterNode.frequency.cancelScheduledValues(startTime);
    this.filterNode.frequency.linearRampToValueAtTime(cutoff, startTime + duration);
  }

  triggerDsgPop(intensity = 1.0) {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    // Create a sudden burst of white noise for the DSG exhaust "fart/pop"
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(180, now);
    noiseFilter.Q.setValueAtTime(2.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5 * intensity, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(now);
  }

  updateStatusUI(active) {
    const soundDot = document.getElementById('sound-dot');
    const soundPulse = document.getElementById('sound-pulse');
    const soundLabel = document.getElementById('sound-label');

    if (active) {
      soundDot?.classList.remove('bg-neutral-600');
      soundDot?.classList.add('bg-gli-red');
      soundPulse?.classList.remove('hidden');
      if (soundLabel) soundLabel.textContent = 'Simulador 2.0 TSI: Ligado';
    } else {
      soundDot?.classList.remove('bg-gli-red');
      soundDot?.classList.add('bg-neutral-600');
      soundPulse?.classList.add('hidden');
      if (soundLabel) soundLabel.textContent = 'Simulador 2.0 TSI: Desligado';
    }
  }
}

window.gliAudio = new GLIEngineAudio();
