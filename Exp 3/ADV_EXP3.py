import streamlit as st
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import plotly.express as px

# Load data
@st.cache
def load_data():
    country_data = pd.read_csv('country_wise_latest.csv')
    try:
        day_wise_data = pd.read_csv('day_wise.csv')
    except FileNotFoundError:
        day_wise_data = None
    return country_data, day_wise_data

country_data, day_wise_data = load_data()

st.cache_data

# Title for the dashboard
st.title("COVID-19 Interactive Dashboard By KRUTIKA")

# Layout with columns
col1, col2 = st.columns(2)

# Boxplot
with col1:
    st.subheader("Boxplot of Confirmed Cases by WHO Region")
    plt.figure(figsize=(10,6))
    sns.boxplot(x='WHO Region', y='Confirmed', data=country_data)
    plt.xticks(rotation=45)
    st.pyplot(plt)

# Violin plot
with col2:
    st.subheader("Violin Plot of Confirmed Cases by WHO Region")
    plt.figure(figsize=(10,6))
    sns.violinplot(x='WHO Region', y='Confirmed', data=country_data)
    plt.xticks(rotation=45)
    st.pyplot(plt)

# 3D Scatter Plot
st.subheader("3D Scatter Plot of Confirmed, Deaths, and Recovered")
fig_3d = px.scatter_3d(
    country_data,
    x='Confirmed',
    y='Deaths',
    z='Recovered',
    color='WHO Region',
    title='3D Scatter Plot of COVID-19 Data'
)
st.plotly_chart(fig_3d)

# Line Chart
if day_wise_data is not None:
    st.subheader("Line Chart of Confirmed Cases Over Time")
    day_wise_data['Date'] = pd.to_datetime(day_wise_data['Date'])
    plt.figure(figsize=(10,6))
    plt.plot(day_wise_data['Date'], day_wise_data['Confirmed'], label='Confirmed Cases', color='blue')
    plt.title('Confirmed Cases Over Time')
    plt.xlabel('Date')
    plt.ylabel('Confirmed Cases')
    plt.legend()
    st.pyplot(plt)
else:
    st.write("Day-wise data is not available.")

# Bar Chart
st.subheader("Bar Chart of Total Confirmed Cases by WHO Region")
plt.figure(figsize=(10,6))
sns.barplot(x='WHO Region', y='Confirmed', data=country_data.groupby('WHO Region').sum().reset_index())
plt.xticks(rotation=45)
st.pyplot(plt)

# Pie Chart
st.subheader("Pie Chart of Confirmed Cases by WHO Region")
fig_pie = px.pie(
    country_data,
    names='WHO Region',
    values='Confirmed',
    title='Distribution of Confirmed Cases by WHO Region'
)
st.plotly_chart(fig_pie)

# Histogram
st.subheader("Histogram of Confirmed Cases")
plt.figure(figsize=(10,6))
plt.hist(country_data['Confirmed'], bins=30, edgecolor='black')
plt.title('Histogram of Confirmed Cases')
plt.xlabel('Confirmed Cases')
plt.ylabel('Frequency')
st.pyplot(plt)

# Scatter Plot
st.subheader("Scatter Plot of Confirmed vs Deaths")
fig_scatter = px.scatter(
    country_data,
    x='Confirmed',
    y='Deaths',
    color='WHO Region',
    title='Scatter Plot of Confirmed Cases vs Deaths'
)
st.plotly_chart(fig_scatter)

# Bubble Plot
st.subheader("Bubble Plot of Confirmed vs Deaths")
fig_bubble = px.scatter(
    country_data,
    x='Confirmed',
    y='Deaths',
    size='Recovered',
    color='WHO Region',
    title='Bubble Plot of Confirmed vs Deaths'
)
st.plotly_chart(fig_bubble)

# Footer or additional information
st.write("Data Source: country_wise_latest.csv and day_wise.csv")
