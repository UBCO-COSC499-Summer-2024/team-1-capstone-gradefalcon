import json
import qrcode

# Step 1: Load and convert JSON data to a string
with open('data.json', 'r') as file:
    json_data = json.load(file)
json_string = json.dumps(json_data)

# Step 2: Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(json_string)
qr.make(fit=True)
img = qr.make_image(fill='black', back_color='white')

# Step 3: Save or display the QR code
img.save('json_qr_code.png')
img.show()
