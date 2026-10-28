# Kannada audio

`public/audio/<key>.mp3` holds a clip for every Kannada word/sentence. The app plays these first.
They were made with **AI4Bharat Indic-TTS** (FastPitch + HiFi-GAN, native Kannada speakers), female voice.

Regenerate after adding seed words/sentences:

    node scripts/gen-audio.mjs --index-only        # list the Kannada strings
    python scripts/gen_audio_indic.py              # needs Python 3.10 + torch 1.13 + AI4Bharat TTS fork + kn.zip model
    python scripts/gen_audio_indic.py --voice male --force

Model: https://github.com/AI4Bharat/Indic-TTS/releases/tag/v1-checkpoints-release (kn.zip, ~1.5 GB).
Without that setup, `node scripts/gen-audio.mjs` makes quick (robotic) clips with espeak-ng as a fallback.
Best of all: replace any clip with a real recording, saved under the same file name.
