import os
from pdf2image import convert_from_path

input_dir = "./inputs"
output_dir = "./inputs"  # Assuming images will be saved in the same input directory
dpi = 300  # DPI value for the conversion

def pdf_to_images(input_dir, output_dir, dpi):
    for root, _, files in os.walk(input_dir):
        for filename in files:
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(root, filename)
                images = convert_from_path(pdf_path, dpi=dpi)
                for i, image in enumerate(images):
                    relative_path = os.path.relpath(root, input_dir)
                    output_subdir = os.path.join(output_dir, relative_path)
                    os.makedirs(output_subdir, exist_ok=True)
                    image_path = os.path.join(output_subdir, f"{os.path.splitext(filename)[0]}_page_{i + 1}.png")
                    image.save(image_path, "PNG")

if __name__ == "__main__":
    pdf_to_images(input_dir, output_dir, dpi)