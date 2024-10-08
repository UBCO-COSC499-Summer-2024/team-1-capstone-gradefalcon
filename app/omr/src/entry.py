"""

 OMRChecker

 Author: Udayraj Deshmukh
 Github: https://github.com/Udayraj123

"""

import json
import os
from csv import QUOTE_NONNUMERIC
from pathlib import Path
from time import time

import pandas as pd
from rich.table import Table

from src.algorithm.evaluation import EvaluationConfig, evaluate_concatenated_response
from src.algorithm.template import Template
from src.schemas.constants import DEFAULT_ANSWERS_SUMMARY_FORMAT_STRING
from src.schemas.defaults import CONFIG_DEFAULTS
from src.utils import constants
from src.utils.file import Paths, setup_dirs_for_paths, setup_outputs_for_template
from src.utils.image import ImageUtils
from src.utils.interaction import InteractionUtils, Stats
from src.utils.logger import console, logger
from src.utils.parsing import get_concatenated_response, open_config_with_defaults
from src.utils.template_drawing import TemplateDrawing

# Load processors
STATS = Stats()


def entry_point(input_dir, args):
    if not os.path.exists(input_dir):
        raise Exception(f"Given input directory does not exist: '{input_dir}'")
    curr_dir = input_dir
    return process_dir(input_dir, curr_dir, args)


def export_omr_metrics(
    outputs_namespace,
    file_name,
    image,
    final_marked,
    colored_final_marked,
    template,
    field_number_to_field_bubble_means,
    global_threshold_for_template,
    global_field_confidence_metrics,
    evaluation_meta,
):
    global_bubble_means_and_refs = []
    for field_bubble_means in field_number_to_field_bubble_means:
        global_bubble_means_and_refs.extend(field_bubble_means)
    # sorted_global_bubble_means_and_refs = sorted(global_bubble_means_and_refs)

    image_metrics_path = outputs_namespace.paths.image_metrics_dir.joinpath(
        f"{os.path.splitext(file_name)[0]}.js"
    )
    with open(
        image_metrics_path,
        "w",
    ) as f:
        json_string = json.dumps(
            {
                "global_threshold_for_template": global_threshold_for_template,
                "template": template,
                "evaluation_meta": (
                    evaluation_meta if evaluation_meta is not None else {}
                ),
                "global_bubble_means_and_refs": global_bubble_means_and_refs,
                "global_field_confidence_metrics": global_field_confidence_metrics,
            },
            default=lambda x: x.to_json(),
            indent=4,
        )
        f.write(f"export default {json_string}")
        logger.info(f"Exported image metrics to: {image_metrics_path}")


def print_config_summary(
    curr_dir,
    omr_files,
    template,
    tuning_config,
    local_config_path,
    evaluation_config,
    args,
):
    logger.info("")
    table = Table(title="Current Configurations", show_header=False, show_lines=False)
    table.add_column("Key", style="cyan", no_wrap=True)
    table.add_column("Value", style="magenta")
    table.add_row("Directory Path", f"{curr_dir}")
    table.add_row("Count of Images", f"{len(omr_files)}")
    table.add_row("Debug Mode ", "ON" if args["debug"] else "OFF")
    table.add_row("Set Layout Mode ", "ON" if args["setLayout"] else "OFF")
    table.add_row(
        "Markers Detection",
        "ON" if "CropOnMarkers" in template.pre_processors else "OFF",
    )
    table.add_row("Detected Template Path", f"{template}")
    if local_config_path:
        table.add_row("Detected Local Config", f"{local_config_path}")
    if evaluation_config:
        table.add_row("Detected Evaluation Config", f"{evaluation_config}")

    table.add_row(
        "Detected pre-processors",
        f"{[pp.__class__.__name__ for pp in template.pre_processors]}",
    )
    table.add_row("Processing Image Shape", f"{template.processing_image_shape}")

    console.print(table, justify="center")


def process_dir(
    root_dir,
    curr_dir,
    args,
    template=None,
    tuning_config=CONFIG_DEFAULTS,
    evaluation_config=None,
):
    # Update local tuning_config (in current recursion stack)
    local_config_path = curr_dir.joinpath(constants.CONFIG_FILENAME)
    if os.path.exists(local_config_path):
        tuning_config = open_config_with_defaults(local_config_path)

    # Update local template (in current recursion stack)
    local_template_path = curr_dir.joinpath(constants.TEMPLATE_FILENAME)
    local_template_exists = os.path.exists(local_template_path)
    if local_template_exists:
        template = Template(
            local_template_path,
            tuning_config,
        )
    # Look for subdirectories for processing
    subdirs = [d for d in curr_dir.iterdir() if d.is_dir()]

    output_dir = Path(args["output_dir"], curr_dir.relative_to(root_dir))
    paths = Paths(output_dir)

    # look for images in current dir to process
    exts = ("*.[pP][nN][gG]", "*.[jJ][pP][gG]", "*.[jJ][pP][eE][gG]")
    omr_files = sorted([f for ext in exts for f in curr_dir.glob(ext)])

    # Exclude images (take union over all pre_processors)
    excluded_files = []
    if template:
        for pp in template.pre_processors:
            excluded_files.extend(Path(p) for p in pp.exclude_files())

    local_evaluation_path = curr_dir.joinpath(constants.EVALUATION_FILENAME)
    # Note: if setLayout is passed, there's no need to load evaluation file
    if not args["setLayout"] and os.path.exists(local_evaluation_path):
        if not local_template_exists:
            logger.warning(
                f"Found an evaluation file without a parent template file: {local_evaluation_path}"
            )
        evaluation_config = EvaluationConfig(
            curr_dir,
            local_evaluation_path,
            template,
            tuning_config,
        )

        excluded_files.extend(
            Path(exclude_file) for exclude_file in evaluation_config.get_exclude_files()
        )

    omr_files = [f for f in omr_files if f not in excluded_files]

    if omr_files:
        if not template:
            logger.error(
                f"Found images, but no template in the directory tree \
                of '{curr_dir}'. \nPlace {constants.TEMPLATE_FILENAME} in the \
                appropriate directory."
            )
            # TODO: restore support for --default-template flag
            raise Exception(
                f"No template file found in the directory tree of {curr_dir}"
            )

        setup_dirs_for_paths(paths)
        outputs_namespace = setup_outputs_for_template(paths, template)

        print_config_summary(
            curr_dir,
            omr_files,
            template,
            tuning_config,
            local_config_path,
            evaluation_config,
            args,
        )
        if args["setLayout"]:
            show_template_layouts(omr_files, template, tuning_config)
        else:
            process_files(
                omr_files,
                template,
                tuning_config,
                evaluation_config,
                outputs_namespace,
            )

    elif not subdirs:
        # Each subdirectory should have images or should be non-leaf
        logger.info(
            f"No valid images or sub-folders found in {curr_dir}.\
            Empty directories not allowed."
        )

    # recursively process sub-folders
    for d in subdirs:
        process_dir(
            root_dir,
            d,
            args,
            template,
            tuning_config,
            evaluation_config,
        )


def show_template_layouts(omr_files, template, tuning_config):
    for file_path in omr_files:
        file_name = file_path.name
        file_path = str(file_path)
        gray_image, colored_image = ImageUtils.read_image_util(file_path, tuning_config)
        (
            gray_image,
            colored_image,
            template,
        ) = template.image_instance_ops.apply_preprocessors(
            file_path, gray_image, colored_image, template
        )
        gray_layout, colored_layout = TemplateDrawing.draw_template_layout(
            gray_image, colored_image, template, tuning_config, shifted=False, border=2
        )
        template_layout = (
            colored_layout
            if tuning_config.outputs.colored_outputs_enabled
            else gray_layout
        )
        InteractionUtils.show(
            f"Template Layout: {file_name}", template_layout, 1, 1, config=tuning_config
        )


def process_files(
    omr_files,
    template,
    tuning_config,
    evaluation_config,
    outputs_namespace,
):
    start_time = int(time())
    files_counter = 0
    STATS.files_not_moved = 0
    logger.set_log_levels(tuning_config.outputs.show_logs_by_type)
    for file_path in omr_files:
        files_counter += 1
        file_name = file_path.name
        file_id = str(file_name)

        gray_image, colored_image = ImageUtils.read_image_util(
            str(file_path), tuning_config
        )

        logger.info("")
        logger.info(
            f"({files_counter}) Opening image: \t'{file_path}'\tResolution: {gray_image.shape}"
        )

        # Start with blank saved images list
        template.save_image_ops.reset_all_save_img()

        template.save_image_ops.append_save_image(
            "Input Image", range(1, 7), gray_image, colored_image
        )

        # TODO: use try catch here and store paths to error files
        # Note: the returned template is a copy
        (
            gray_image,
            colored_image,
            template,
        ) = template.image_instance_ops.apply_preprocessors(
            file_path, gray_image, colored_image, template
        )

        if gray_image is None:
            # Error OMR case
            new_file_path = outputs_namespace.paths.errors_dir.joinpath(file_name)
            outputs_namespace.OUTPUT_SET.append(
                [file_name] + outputs_namespace.empty_resp
            )
            if check_and_move(
                constants.ERROR_CODES.NO_MARKER_ERR, file_path, new_file_path
            ):
                err_line = [
                    file_name,
                    file_path,
                    new_file_path,
                    "NA",
                ] + outputs_namespace.empty_resp
                pd.DataFrame(err_line, dtype=str).T.to_csv(
                    outputs_namespace.files_obj["Errors"],
                    mode="a",
                    quoting=QUOTE_NONNUMERIC,
                    header=False,
                    index=False,
                )
            continue

        (
            response_dict,
            multi_marked,
            _,
            field_number_to_field_bubble_means,
            global_threshold_for_template,
            global_field_confidence_metrics,
        ) = template.image_instance_ops.read_omr_response(
            gray_image, colored_image, template, file_path
        )

        # TODO: move inner try catch here
        # concatenate roll nos, set unmarked responses, etc
        omr_response = get_concatenated_response(response_dict, template)

        if (
            evaluation_config is None
            or not evaluation_config.get_should_explain_scoring()
        ):
            logger.info(f"Read Response: \n{omr_response}")

        score, evaluation_meta = 0, None
        if evaluation_config is not None:
            score, evaluation_meta = evaluate_concatenated_response(
                omr_response, evaluation_config
            )
            (
                default_answers_summary,
                *_,
            ) = evaluation_config.get_formatted_answers_summary(
                DEFAULT_ANSWERS_SUMMARY_FORMAT_STRING
            )
            logger.info(
                f"(/{files_counter}) Graded with score: {round(score, 2)}\t {default_answers_summary} \t file: '{file_id}'"
            )
        else:
            logger.info(f"(/{files_counter}) Processed file: '{file_id}'")

        save_marked_dir = outputs_namespace.paths.save_marked_dir

        # Save output image with bubble values and evaluation meta
        (
            final_marked,
            colored_final_marked,
        ) = TemplateDrawing.draw_template_layout(
            gray_image,
            colored_image,
            template,
            tuning_config,
            file_id,
            field_number_to_field_bubble_means,
            save_marked_dir=save_marked_dir,
            evaluation_meta=evaluation_meta,
            evaluation_config=evaluation_config,
        )

        # Save output stack images
        template.save_image_ops.save_image_stacks(
            file_id,
            save_marked_dir,
            key=None,
            images_per_row=5 if tuning_config.outputs.show_image_level >= 5 else 4,
        )

        # Save output metrics
        if tuning_config.outputs.save_image_metrics:
            export_omr_metrics(
                outputs_namespace,
                file_name,
                gray_image,
                final_marked,
                colored_final_marked,
                template,
                field_number_to_field_bubble_means,
                global_threshold_for_template,
                global_field_confidence_metrics,
                evaluation_meta,
            )

        # Save output CSV results
        resp_array = []
        for k in template.output_columns:
            resp_array.append(omr_response[k])

        outputs_namespace.OUTPUT_SET.append([file_name] + resp_array)

        if multi_marked == 0 or not tuning_config.outputs.filter_out_multimarked_files:
            STATS.files_not_moved += 1
            new_file_path = save_marked_dir.joinpath(file_id)
            # Enter into Results sheet-
            results_line = [file_name, file_path, new_file_path, score] + resp_array
            # Write/Append to results_line file(opened in append mode)
            pd.DataFrame(results_line, dtype=str).T.to_csv(
                outputs_namespace.files_obj["Results"],
                mode="a",
                quoting=QUOTE_NONNUMERIC,
                header=False,
                index=False,
            )
        else:
            # multi_marked file
            logger.info(f"[{files_counter}] Found multi-marked file: '{file_id}'")
            new_file_path = outputs_namespace.paths.multi_marked_dir.joinpath(file_name)
            if check_and_move(
                constants.ERROR_CODES.MULTI_BUBBLE_WARN, file_path, new_file_path
            ):
                mm_line = [file_name, file_path, new_file_path, "NA"] + resp_array
                pd.DataFrame(mm_line, dtype=str).T.to_csv(
                    outputs_namespace.files_obj["MultiMarked"],
                    mode="a",
                    quoting=QUOTE_NONNUMERIC,
                    header=False,
                    index=False,
                )
            # else:
            #     TODO:  Add appropriate record handling here
            #     pass

    logger.reset_log_levels()

    print_stats(start_time, files_counter, tuning_config)


def check_and_move(error_code, file_path, filepath2):
    # TODO: fix file movement into error/multimarked/invalid etc again
    STATS.files_not_moved += 1
    return True


def print_stats(start_time, files_counter, tuning_config):
    time_checking = max(1, round(time() - start_time, 2))
    log = logger.info
    log("")
    log(f"{'Total file(s) moved':<27}: {STATS.files_moved}")
    log(f"{'Total file(s) not moved':<27}: {STATS.files_not_moved}")
    log("--------------------------------")
    log(
        f"{'Total file(s) processed':<27}: {files_counter} ({'Sum Tallied!' if files_counter == (STATS.files_moved + STATS.files_not_moved) else 'Not Tallying!'})"
    )

    if tuning_config.outputs.show_image_level <= 0:
        log(
            f"\nFinished Checking {files_counter} file(s) in {round(time_checking, 1)} seconds i.e. ~{round(time_checking / 60, 1)} minute(s)."
        )
        log(
            f"{'OMR Processing Rate':<27}:\t ~ {round(time_checking / files_counter,2)} seconds/OMR"
        )
        log(
            f"{'OMR Processing Speed':<27}:\t ~ {round((files_counter * 60) / time_checking, 2)} OMRs/minute"
        )
    else:
        log(f"\n{'Total script time':<27}: {time_checking} seconds")

    if tuning_config.outputs.show_image_level <= 1:
        log(
            "\nTip: To see some awesome visuals, open config.json and increase 'show_image_level'"
        )
