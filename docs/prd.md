# Kiran Coffee Works Daily Sales Tracker Requirements Document

## 1. Tool Overview

### 1.1 Tool Name
Kiran Coffee Works Daily Sales Tracker

### 1.2 Tool Description
A daily sales tracking application for Kiran Coffee Works ice cream shop that records daily operations, calculates costs and profits, and provides monthly sales summaries with visual profit/loss graphs.
\n## 2. Core Features\n
### 2.1 Daily Entry Form
The application should provide a form to record daily operations with the following fields:

**Raw Materials Usage:**
- Milk: Quantity used (in liters) and price per liter (in rupees)
- Softy Premix: Number of packets used and price per packet (in rupees)
- Coffee Decoction: Quantity used (in liters) and price per liter (in rupees)
- Cups: Number of cups used and price per cup (in rupees)
- Spoons: Number of spoons used and price per spoon (in rupees)
\n**Sales Data:**
- Total cups sold for the day
\n**Auto-calculations for each item:**
- Total cost = Quantity used × Unit price
\n### 2.2 Default Unit Costs Settings
Provide a separate configuration section where users can set default unit costs for:
- Price per liter of milk
- Price per packet of softy premix
- Price per liter of coffee decoction
- Price per cup
- Price per spoon

These default values will auto-fill the daily entry form but can be overridden for specific days if needed.
\n### 2.3 Daily Profit/Loss Calculation
**Formula:**
- Total Daily Cost = Sum of all material costs (milk + premix + coffee + cups + spoons)
- Daily Profit/Loss = Revenue from cups sold - Total Daily Cost

**Display Rules:**
- If profit: Display amount in green color
- If loss: Display amount in red color

### 2.4 Delete Entry Option
Each daily entry should include a delete button that allows users to:
- Remove a specific daily record from the database
- Display a confirmation prompt before deletion to prevent accidental removal
- Update monthly and yearly summaries automatically after deletion
\n### 2.5 Monthly Sales Summary
Each month should have a dedicated sheet that:
- Lists all daily entries for that month\n- Calculates total monthly sales
- Calculates total monthly costs
- Calculates total monthly profit/loss
\n### 2.6 Yearly Sales Summary
Provide a yearly overview that displays:
- Total sales for the entire year
- Total costs for the entire year
- Total profit/loss for the entire year
- Month-by-month breakdown showing monthly sales, costs, and profit/loss
- Visual graph showing monthly profit/loss trends across the year

### 2.7 Profit/Loss Graph
Display a visual graph showing:
- Daily profit/loss trends
- X-axis: Days of the month
- Y-axis: Profit/loss amount in rupees
- Green bars for profit days, red bars for loss days

## 3. Data Display Format

### 3.1 Daily Record Table
Each daily entry should display:
- Date
- Milk: Liters used, unit price, total cost
- Softy Premix: Packets used, unit price, total cost
- Coffee Decoction: Liters used, unit price, total cost\n- Cups: Quantity used, unit price, total cost
- Spoons: Quantity used, unit price, total cost
- Total cups sold
- Total cost for the day
- Profit/Loss (color-coded)\n- Delete button

### 3.2 Currency\nAll prices and calculations should be in Indian Rupees (₹)\n
## 4. Design Style
- **Color Scheme:** Clean white background with blue accents for headers (#2196F3), green for profit indicators (#4CAF50), red for loss indicators (#F44336)
- **Layout:** Spreadsheet-style table layout with clear column headers, alternating row backgrounds for better readability, and fixed header row when scrolling
- **Visual Elements:** Simple line/bar graph with grid lines and axis labels, rounded corners (4px) for input fields and buttons, subtle shadows for cards and modals
- **Typography:** Sans-serif font (Roboto or Inter) with medium weight (500) for numbers and financial figures, regular weight (400) for labels