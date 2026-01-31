# Tree Assets

This directory contains tree graphics for per-dose growth stages in Microverse Meds.

## Current Files

Currently using **SVG placeholders** for development. Replace these with your actual PNG/SVG tree assets.

## File Structure

- `1.svg` - First growth stage
- `2.svg` - Second growth stage
- `3.svg` - Third growth stage
- ...and so on, one file per dose

## Replacing Placeholders

To use your custom tree images:

1. Prepare one tree image per dose
2. Name them: `1.png`, `2.png`, `3.png`, ...
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
