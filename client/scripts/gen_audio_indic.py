"""
Natural Kannada voice for every word / sentence, using AI4Bharat Indic-TTS
(FastPitch + HiFi-GAN trained on native Kannada speakers, male + female).

Usage (see scripts/README-audio.md for the one-time setup):
    node scripts/gen-audio.mjs --index-only      # refresh public/audio/index.json
    python scripts/gen_audio_indic.py            # (re)generate public/audio/<key>.mp3
    python scripts/gen_audio_indic.py --voice male --force
"""
import argparse, json, os, subprocess, sys, tempfile
ap = argparse.ArgumentParser()
ap.add_argument('--model-dir', default=os.environ.get('INDIC_TTS_KN', '/tmp/knm/kn'))
ap.add_argument('--voice', default='female', choices=['female', 'male'])
ap.add_argument('--force', action='store_true')
a = ap.parse_args()
out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
idx = json.load(open(os.path.join(out, 'index.json'), encoding='utf8'))
from TTS.utils.synthesizer import Synthesizer
d = a.model_dir
syn = Synthesizer(tts_checkpoint=f'{d}/fastpitch/best_model.pth', tts_config_path=f'{d}/fastpitch/config.json', tts_speakers_file=f'{d}/fastpitch/speakers.pth',
                  vocoder_checkpoint=f'{d}/hifigan/best_model.pth', vocoder_config=f'{d}/hifigan/config.json', use_cuda=False)
todo = [(k, t) for k, t in idx.items() if a.force or not os.path.exists(os.path.join(out, k + '.indic'))]
print(len(todo), 'clips to generate', flush=True)
bad = []
for n, (k, t) in enumerate(todo, 1):
    try:
        wav = syn.tts(t, speaker_name=a.voice)
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f: tmp = f.name
        syn.save_wav(wav, tmp)
        # trim silence at both ends, level-match, add a short tail so the last syllable is never clipped, then mp3
        af = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,loudnorm=I=-16:TP=-1.5,apad=pad_dur=0.12'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-ac', '1', '-af', af, '-c:a', 'libmp3lame', '-b:a', '64k', os.path.join(out, k + '.mp3')], check=True)
        open(os.path.join(out, k + '.indic'), 'w').close(); os.remove(tmp)
    except Exception as e:
        bad.append(t); print('FAILED', t, e, flush=True)
    if n % 25 == 0: print(n, '/', len(todo), flush=True)
for f in os.listdir(out):
    if f.endswith('.indic'): os.remove(os.path.join(out, f))
print('done; failed:', len(bad), bad[:5], flush=True)
