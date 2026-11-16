"""Generate narration audio with Kokoro.

Reads narration.json ({sceneId: text}), writes public/audio/<sceneId>.wav
and src/durations.json ({sceneId: seconds}) so Remotion scene lengths
follow the narration.

Usage:  .venv\\Scripts\\python tts\\narrate.py [sceneId ...]
        (no args = all scenes; with args = only those scenes)
"""
import json
import sys
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
VOICE = "af_heart"
SPEED = 1.0
LANG = "en-us"


def main() -> None:
    narration = json.loads((ROOT / "narration.json").read_text(encoding="utf-8"))
    only = set(sys.argv[1:])
    out_dir = ROOT / "public" / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)
    dur_path = ROOT / "src" / "durations.json"
    durations = json.loads(dur_path.read_text(encoding="utf-8")) if dur_path.exists() else {}

    kokoro = Kokoro(str(ROOT / "models" / "kokoro-v1.0.onnx"), str(ROOT / "models" / "voices-v1.0.bin"))
    for scene_id, text in narration.items():
        if only and scene_id not in only:
            continue
        samples, sr = kokoro.create(text, voice=VOICE, speed=SPEED, lang=LANG)
        sf.write(out_dir / f"{scene_id}.wav", samples, sr)
        durations[scene_id] = round(len(samples) / sr, 3)
        print(f"{scene_id}: {durations[scene_id]:.2f}s")

    # keep only scenes that still exist in narration.json
    durations = {k: durations[k] for k in narration if k in durations}
    dur_path.write_text(json.dumps(durations, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
