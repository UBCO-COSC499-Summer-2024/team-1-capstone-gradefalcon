import cv2
from src.processors.interfaces.ImageTemplatePreprocessor import (
    ImageTemplatePreprocessor,
)

class BorderPreprocessor(ImageTemplatePreprocessor):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        options = self.options
        self.border_size = options.get("border_size", 10)
        self.border_color = options.get("border_color", [0, 0, 0])  # Default is black

    def apply_filter(self, image, colored_image, template, file_path):
        bordered_image = cv2.copyMakeBorder(
            image,
            top=self.border_size,
            bottom=self.border_size,
            left=self.border_size,
            right=self.border_size,
            borderType=cv2.BORDER_CONSTANT,
            value=self.border_color
        )
        return bordered_image, colored_image, template
