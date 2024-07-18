from dataclasses import dataclass

import cv2
from matplotlib import pyplot
from screeninfo import get_monitors, ScreenInfoError

from src.utils.image import ImageUtils
from src.utils.logger import logger

try:
    monitors = get_monitors()
    monitor_window = monitors[0] if monitors else None
except ScreenInfoError as e:
    # Handle the error gracefully in headless environments
    monitor_window = None
    print(f"ScreenInfoError: {e}")

@dataclass
class ImageMetrics:
    # Set default values for window width and height
    window_width: int = 1920
    window_height: int = 1080
    window_x: int = 0
    window_y: int = 0
    reset_pos = [0, 0]

    def __post_init__(self):
        if monitor_window is not None:
            self.window_width = monitor_window.width
            self.window_height = monitor_window.height


class InteractionUtils:
    """Perform primary functions such as displaying images and reading responses"""

    image_metrics = ImageMetrics()

    @staticmethod
    def show(
        name,
        image,
        pause=1,
        resize_to_width=False,
        resize_to_height=False,
        reset_pos=None,
        config=None,
    ):
        image_metrics = InteractionUtils.image_metrics
        if image is None:
            logger.warning(f"'{name}' - NoneType image to show!")
            if pause:
                cv2.destroyAllWindows()
            return
        if config is not None:
            display_width, display_height = config.outputs.display_image_dimensions
            if resize_to_width:
                image_to_show = ImageUtils.resize_util(image, u_width=display_width)
            elif resize_to_height:
                image_to_show = ImageUtils.resize_util(image, u_height=display_height)
            else:
                image_to_show = image
        else:
            image_to_show = image

        cv2.imshow(name, image_to_show)

        if reset_pos:
            image_metrics.window_x = reset_pos[0]
            image_metrics.window_y = reset_pos[1]

        cv2.moveWindow(
            name,
            image_metrics.window_x,
            image_metrics.window_y,
        )

        h, w = image_to_show.shape[:2]

        # Set next window position
        margin = 25
        h += margin
        w += margin

        # TODO: get ppi for correct positioning?
        adjustment_ratio = 3
        h, w = h // adjustment_ratio, w // adjustment_ratio
        if image_metrics.window_x + w > image_metrics.window_width:
            image_metrics.window_x = 0
            if image_metrics.window_y + h > image_metrics.window_height:
                image_metrics.window_y = 0
            else:
                image_metrics.window_y += h
        else:
            image_metrics.window_x += w

        if pause:
            logger.info(
                f"Showing '{name}'\n\t Press Q on image to continue. Press Ctrl + C in terminal to exit"
            )

            close_all_on_wait_key("q")
            InteractionUtils.image_metrics.window_x = 0
            InteractionUtils.image_metrics.window_y = 0


class Stats:
    # TODO Fill these for stats
    # multiMarkedFilesCount = 0
    # errorFilesCount = 0
    files_moved = 0
    files_not_moved = 0


def close_all_on_wait_key(key="q"):
    esc_key = 27
    while cv2.waitKey(1) & 0xFF not in [ord(key), esc_key]:
        pass
    cv2.destroyAllWindows()
    # also close open plots!
    pyplot.close()
