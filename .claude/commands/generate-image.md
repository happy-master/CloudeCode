---
description: Generate a polished, design-conscious image via OpenAI's gpt-image-1 API
---

Generate a high-quality, design-forward image for: $ARGUMENTS

Steps:
1. Expand the request above into a refined image-generation prompt. Add concrete art-direction detail the user didn't spell out but would want: composition, lighting, color palette, style/medium, mood, level of detail. Keep the user's actual subject and intent intact — enhance, don't replace it.
2. Pick sensible `--size` (1024x1024 for square/icons/avatars, 1024x1536 for portrait/posters, 1536x1024 for landscape/banners) and keep `--quality high` unless the user asked for a quick draft.
3. Run the generator:
   ```bash
   node scripts/generate_image.mjs "<refined prompt>" --size <size> --quality high --out generated/<descriptive-name>.png
   ```
4. If it fails because `OPENAI_API_KEY` is missing, tell the user to add it to `.env` (see `.env.example`) or export it in their shell, then stop — don't guess a key.
5. On success, show the generated image to the user (Read the output path as an image) and briefly note the prompt/settings used.
