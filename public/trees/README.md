# Tree Assets

This directory contains tree graphics for the 4 growth stages in Microverse Meds.

## Current Files

Currently using **SVG placeholders** for development. Replace these with your actual PNG/SVG tree assets.

## File Structure

- `stage-1.svg` - **Sapling** (0-29 doses logged)
- `stage-2.svg` - **Young Tree** (30-99 doses logged)
- `stage-3.svg` - **Mature Tree** (100-299 doses logged)
- `stage-4.svg` - **Ancient Tree** (300+ doses logged)

## Replacing Placeholders

To use your custom tree images:

1. Prepare 4 tree images (one for each growth stage)
2. Name them: `stage-1.png`, `stage-2.png`, `stage-3.png`, `stage-4.png`
3. Recommended dimensions: **400x400px** to **600x600px**
4. Format: **PNG with transparency** for best results
5. Replace the placeholder SVG files with your PNG files

## Design Guidelines

- **Transparent background** recommended for floating effect
- **Progressive growth**: Each stage should be visibly larger/more complex
- **Warm, natural tones**: Match the forest green color palette (#4d9961 to #8ec4a4)
- **Centered composition**: Trees should be vertically centered in the canvas
- **Seasonal variants** (future): Consider creating seasonal versions for Spring/Summer/Fall/Winter

## Notes

The TreeCanvas component will automatically:
- Apply a floating animation to your trees
- Add seasonal gradient backgrounds
- Display sparkle effects around the tree
- Scale appropriately for mobile and desktop viewports
