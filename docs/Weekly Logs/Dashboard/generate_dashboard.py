import os
import re
import pandas as pd
import matplotlib.pyplot as plt
import io

# # Define the relative path to the directory containing the weekly logs
log_dir = 'docs/weekly_logs/Logs'

dashboard_dir = 'docs/weekly_logs/Dashboard'
print(f"Logs directory path: {log_dir}")
print(f"Dashboard directory path: {dashboard_dir}")

# Function to find the most recent file in the directory
def find_most_recent_file(directory):
    print(f"Checking directory: {directory}")
    files = [os.path.join(directory, f) for f in os.listdir(directory) if f.endswith('.md')]
    if not files:
        raise FileNotFoundError(f"No .md files found in directory: {directory}")
    most_recent_file = max(files, key=os.path.getmtime)
    return most_recent_file

# Function to extract tasks from the log file
def extract_tasks_from_log(log_text):
    task_pattern = re.compile(r'\| (\w+)\s+\|\s+(.*?)\s+\|\s+(.*?)\s+\|\s+(.*?)\s+\|\s+(Completed|In Progress) \|')
    tasks = task_pattern.findall(log_text)
    tasks_df = pd.DataFrame(tasks, columns=["Task ID", "Description", "Feature", "Assigned To", "Status"])
    return tasks_df

# Function to update the markdown file with the visualization link
def update_markdown_file(file_path, image_path):
    with open(file_path, 'a') as file:
        file.write("\n### Task Status Distribution\n")
        file.write(f"![Task Status Distribution]({image_path})\n")

# Find the most recent log file
try:
    most_recent_log_file = find_most_recent_file(log_dir)
    print(f"Most recent log file: {most_recent_log_file}")
except FileNotFoundError as e:
    print(e)
    exit(1)

# Read the contents of the most recent log file
with open(most_recent_log_file, 'r') as file:
    log_text = file.read()

# Extract tasks from the log text
tasks_df = extract_tasks_from_log(log_text)

# Generate a summary
completed_tasks_df = tasks_df[tasks_df['Status'] == 'Completed']
in_progress_tasks_df = tasks_df[tasks_df['Status'] == 'In Progress']
backlog_tasks_df = tasks_df[tasks_df['Status'] == 'Backlog']

# Save DataFrame to a CSV file
tasks_df.to_csv(os.path.join(dashboard_dir, 'tasks.csv'), index=False)

# Visualizations
# Task Status Distribution
status_counts = tasks_df['Status'].value_counts()
plt.figure(figsize=(8, 6))
status_counts.plot(kind='pie', autopct='%1.1f%%', startangle=90)
plt.title('Task Status Distribution')
plt.ylabel('')
image_path = os.path.join(dashboard_dir, 'task_status_distribution.png')
plt.savefig(image_path)
plt.close()

# Update the markdown file with the link to the visualization
image_relative_path = f"../Dashboard/task_status_distribution.png"
update_markdown_file(most_recent_log_file, image_relative_path)

print(f"Visualization has been generated and saved as 'task_status_distribution.png' in {dashboard_dir}.")
print(f"The markdown file {most_recent_log_file} has been updated with the link to the visualization.")