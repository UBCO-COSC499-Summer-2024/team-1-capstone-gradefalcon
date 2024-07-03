from pdf2image import convert_from_path
import os

def convert_pdf_to_images(pdf_path, output_folder, dpi=300):
    """
    Convert PDF to images.

    :param pdf_path: Path to the PDF file.
    :param output_folder: Folder to save the images.
    :param dpi: Dots per inch (DPI) for the conversion.
    :return: List of image paths.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    images = convert_from_path(pdf_path, dpi=dpi)
    image_paths = []

    for i, image in enumerate(images):
        image_path = os.path.join(output_folder, f'page_{i + 1}.png')
        image.save(image_path, 'PNG')
        image_paths.append(image_path)

    return image_paths
