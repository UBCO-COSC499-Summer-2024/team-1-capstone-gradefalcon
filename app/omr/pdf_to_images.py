import os
from pdf2image import convert_from_path

input_dir = "./inputs"
output_dir = "./inputs"  # Assuming images will be saved in the same input directory
dpi = 300  # DPI value for the conversion

def pdf_to_images(input_dir, output_dir, dpi):
    for filename in os.listdir(input_dir):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(input_dir, filename)
            images = convert_from_path(pdf_path, dpi=dpi)
            for i, image in enumerate(images):
                image_path = os.path.join(output_dir, f"{os.path.splitext(filename)[0]}_page_{i + 1}.png")
                image.save(image_path, "PNG")

if __name__ == "__main__":
    pdf_to_images(input_dir, output_dir, dpi)
