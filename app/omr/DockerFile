# Use the Python 3.11 slim image as the base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Enable non-interactive mode for debconf
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Update the package repository and install required dependencies
# Added poppler-utils for pdf2image
RUN apt-get update -y && \
    apt-get install -y build-essential cmake unzip pkg-config \
    libjpeg-dev libpng-dev libtiff-dev \
    libavcodec-dev libavformat-dev libswscale-dev libv4l-dev \
    libatlas-base-dev gfortran && \
    apt-get install -y poppler-utils && \ 
    apt-get clean && \
    apt-get -y autoremove

# Install Python dependencies
RUN pip3 install --user opencv-python-headless opencv-contrib-python-headless    

# Copy the Flask and OMR requirements files and the development and production requirements files
COPY ./requirements.dev.txt /app
COPY ./requirements.txt /app

# Install additional Python dependencies for development
RUN pip3 install -r requirements.dev.txt

# Copy the entire Flask and OMR project into the container
COPY . /app

# Set environment variables
ENV OMR_CHECKER_CONTAINER True

# Set the default command to run the Flask server
CMD ["python3", "app.py"]
