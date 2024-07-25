from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def draw_bubble_sheet(filename):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Function to draw a circle
    def draw_circle(x, y, radius=10):
        c.circle(x, y, radius, stroke=1, fill=0)

    # Function to draw text
    def draw_text(x, y, text, size=12):
        c.setFont("Helvetica", size)
        c.drawString(x, y, text)
    
    # Draw header text
    draw_text(50, height - 50, "Answer Sheet")
    draw_text(50, height - 70, "Please follow the directions on the exam question sheet. Fill in the entire circle that corresponds to your answer for each question on the exam. Erase marks completely to make a change.")
    draw_text(50, height - 90, "Student I.D.")

    # Draw ID circles
    start_x = 100
    start_y = height - 130
    for i in range(10):
        draw_text(start_x + i * 25, start_y, str(i))
        for j in range(10):
            draw_circle(start_x + i * 25, start_y - 20 - j * 20)

    # Draw question bubbles
    start_x = 50
    start_y = height - 200
    for question in range(1, 101):
        if question % 25 == 1 and question != 1:
            start_y = height - 200
            start_x += 200
        draw_text(start_x - 30, start_y, str(question))
        for option in range(1, 6):
            draw_circle(start_x + (option - 1) * 25, start_y)
        start_y -= 20

    # Save the PDF
    c.save()

# Create the bubble sheet
draw_bubble_sheet("inputs/bubble_sheet.pdf")
