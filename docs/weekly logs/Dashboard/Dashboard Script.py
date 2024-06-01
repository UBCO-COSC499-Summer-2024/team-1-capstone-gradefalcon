import os
import re
import pandas as pd
from datetime import datetime

# Define the path to the directory containing the weekly logs
log_dir = r'docs\weekly logs\Weekly Logs'

# Function to find the most recent file in the directory
def find_most_recent_file(directory):
    files = [os.path.join(directory, f) for f in os.listdir(directory) if f.endswith('.md')]
    most_recent_file = max(files, key=os.path.getmtime)
    return most_recent_file

# Function to extract tasks from the log file
def extract_tasks_from_log(log_text):
    task_pattern = re.compile(r'\| (\w+)\s+\|\s+(.*?)\s+\|\s+(.*?)\s+\|\s+(.*?)\s+\|\s+(Completed|In Progress) \|')
    tasks = task_pattern.findall(log_text)
    tasks_df = pd.DataFrame(tasks, columns=["Task ID", "Description", "Feature", "Assigned To", "Status"])
    return tasks_df

# Function to extract other sections from the log file
def extract_section(log_text, section_header):
    pattern = re.compile(rf'## {section_header}:\n(.*?)(?=\n##|\Z)', re.DOTALL)
    match = pattern.search(log_text)
    if match:
        return match.group(1).strip()
    return None

# Find the most recent log file
most_recent_log_file = find_most_recent_file(log_dir)

# Read the contents of the most recent log file
with open(most_recent_log_file, 'r') as file:
    log_text = file.read()

# Extract tasks from the log text
tasks_df = extract_tasks_from_log(log_text)

# Extract other sections
date_range = extract_section(log_text, "Date Range")
features = extract_section(log_text, "Features in the Project Plan Cycle")
tasks_next_cycle = extract_section(log_text, "Tasks for Next Cycle")
burn_up_chart = extract_section(log_text, "Burn-up Chart (Velocity)")
times = extract_section(log_text, "Times for Team/Individual")
completed_tasks = extract_section(log_text, "Completed Tasks")
in_progress_tasks = extract_section(log_text, "In Progress Tasks")
test_report = extract_section(log_text, "Test Report / Testing Status")
overview = extract_section(log_text, "Overview")

# Generate a summary
completed_tasks_df = tasks_df[tasks_df['Status'] == 'Completed']
in_progress_tasks_df = tasks_df[tasks_df['Status'] == 'In Progress']

# Save DataFrame to a CSV file or generate visualizations
tasks_df.to_csv('tasks.csv', index=False)

# Optionally, display the DataFrame to the user
import ace_tools as tools; tools.display_dataframe_to_user(name="Tasks Overview", dataframe=tasks_df)

# Generate Markdown for the dashboard
with open('weekly_team_dashboard.md', 'w') as f:
    f.write("# Weekly Team Dashboard\n")
    f.write(f"## Date Range:\n{date_range}\n")
    f.write("### Task Status Distribution\n")
    f.write("![Task Status Distribution](task_status_distribution.png)\n\n")
    f.write("### Features in the Project Plan Cycle\n")
    f.write(f"{features}\n\n")
    f.write("### Associated Tasks from Project Board\n")
    f.write(tasks_df.to_markdown(index=False))
    f.write("\n\n### Tasks for Next Cycle\n")
    f.write(tasks_next_cycle)
    f.write("\n\n### Burn-up Chart (Velocity)\n")
    f.write(f"![Burn-up Chart]({burn_up_chart})\n\n")
    f.write("### Times for Team/Individual\n")
    f.write(times)
    f.write("\n\n### Completed Tasks\n")
    f.write(completed_tasks_df.to_markdown(index=False))
    f.write("\n\n### In Progress Tasks\n")
    f.write(in_progress_tasks_df.to_markdown(index=False))
    f.write("\n\n### Test Report / Testing Status\n")
    f.write(test_report)
    f.write("\n\n### Overview\n")
    f.write(overview)
