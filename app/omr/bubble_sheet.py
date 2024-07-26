import json
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def draw_bubble_sheet_from_json(json_path, output_path):
    with open(json_path, 'r') as f:
        template = json.load(f)
    
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    
    # Function to draw a circle
    def draw_circle(x, y, radius=10):
        c.circle(x, y, radius, stroke=1, fill=0)

    # Function to draw text
    def draw_text(x, y, text, size=12):
        c.setFont("Helvetica", size)
        c.drawString(x, y, text)
    
    # Page dimensions from the JSON
    page_width, page_height = template["pageDimensions"]
    
    # Adjust bubble dimensions
    bubble_width, bubble_height = template["bubbleDimensions"]
    bubble_radius = min(bubble_width, bubble_height) / 2

    # Draw header text
    draw_text(50, height - 50, "Answer Sheet")
    draw_text(50, height - 70, "Please follow the directions on the exam question sheet. Fill in the entire circle that corresponds to your answer for each question on the exam. Erase marks completely to make a change.")
    draw_text(width / 2 - 30, height - 110, "Student I.D.", size=14)

    # Draw field blocks
    for block_name, block_info in template["fieldBlocks"].items():
        origin_x, origin_y = block_info["origin"]
        labels = block_info["fieldLabels"]
        bubbles_gap = block_info["bubblesGap"]
        labels_gap = block_info["labelsGap"]

        if block_name == "StudentID":
            # Center the StudentID section
            id_start_x = (width / 2) - (5 * bubbles_gap) + 12
            id_start_y = height - 130
            for i in range(10):
                draw_text(id_start_x + i * labels_gap, id_start_y, str(i))
                for j in range(10):
                    draw_circle(id_start_x + i * labels_gap, id_start_y - 20 - j * bubbles_gap, bubble_radius)
        else:
            # Draw MCQ blocks
            for index, label in enumerate(labels):
                y_offset = index * labels_gap
                draw_text(origin_x - 20, height - origin_y - y_offset, str(index + 1))
                for i in range(5):
                    draw_circle(origin_x + i * bubbles_gap, height - origin_y - y_offset, bubble_radius)

    # Save the PDF
    c.save()

# Create the bubble sheet from JSON template
draw_bubble_sheet_from_json("./inputs/template.json","./inputs/bubble_sheet.pdf")
