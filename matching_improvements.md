# Improving Contour Matching Strategy

To ensure the AI strictly adheres to the cloud silhouettes we extract, we should consider the following future improvements:

## 1. Structural Mask Enhancement
Currently, we use a 1px outline. Transitioning to a **Solid Silhouette Mask** (white for cloud area, black for sky) would provide the Vision model with a clearer "boundary box."
- **Benefit:** Models often interpret solid shapes more accurately than thin wireframes.

## 2. Multi-Stage Refinement
Instead of one-shot generation, implement a two-pass system:
- **Pass 1 (Base):** Generate a low-resolution "rough" version focused solely on shape.
- **Pass 2 (Detail):** Use the rough version + the original silhouette as a combined prompt to add texture and lighting.

## 3. Geometric Descriptor Prompting
The `interpretCloud` service could extract specific geometric descriptors (e.g., "The top right is jagged like a saw blade," "The bottom is a smooth semi-circle").
- **Benefit:** Supplementing visual masks with natural language spatial descriptions helps the transformer layers align concepts with the image grid.

## 4. Canny-Edge Logic
Switch from Sobel gradients to **Canny Edge Detection**. 
- **Benefit:** Canny provides cleaner, single-pixel thin lines that are less "noisy," allowing the AI to see the primary structural "skeleton" without the internal cloud texture causing confusion.

## 5. Negative Prompting (via Instruction)
Explicitly tell the model what *not* to do near the boundaries.
- **Instruction:** "Do not allow any pixels of the subject to exist outside the white boundary. Treat the black area of the mask as a hard physical wall."
