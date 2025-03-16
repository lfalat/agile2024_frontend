import * as React from "react";
import Layout from "../../components/Layout";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useAuth } from "../../hooks/AuthProvider";
import { useEffect, useState } from "react";
import api from "../../app/api";
import Goal from "../../types/Goal";
import { useNavigate } from "react-router-dom";

type Review = {
  reviewIds: string[];
  message: string;
  messageType: number;
};

const columnsTasks = [{ field: "message", headerName: "Prebiehajúce úlohy" , flex:1}];
const columnsGoals = [{ field: "goal", headerName: "Aktívne ciele", flex: 1 }];
const statusColors: { [key: string]: string } = {
  "Dokončený": "#4CAF50",
  "Prebiehajúci": "#FFA500",
  "Nezačatý": "#F44336",
  "Zrušený": "#2196F3",
};

const HomeScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const nav = useNavigate();
  const [filteredGoals, setFilteredGoals] = useState<{ id: number; goal: string }[]>([]);
  const [goalStats, setGoalStats] = useState<{ [key: string]: number }>({});
  const [goalData, setGoalData] = useState<{ id: number; value: number; label: string; color: string }[]>([]);
  const [totalGoals, setTotalGoals] = useState(0);
  const [reviews, setReviews] = useState([]);


  useEffect(() => {
    api.get("/Goal/MyGoals")
      .then((res) => {
        console.log("Fetched goals:", res.data);

        // Počítanie statusov cieľov
        const stats: { [key: string]: number } = {};
        res.data.forEach((goal: Goal) => {
          stats[goal.statusDescription] = (stats[goal.statusDescription] || 0) + 1;
        });

        setGoalStats(stats);
        
        const totalGoalsCount = Object.values(stats).reduce((total, count) => total + count, 0);
        setTotalGoals(totalGoalsCount);

        // Filter
        const filtered = res.data
          .filter((goal: Goal) => goal.statusDescription === "Prebiehajúci")
          .map((goal: Goal) => ({ id: goal.id, goal: goal.name }));

        setFilteredGoals(filtered);
      })
      .catch((err) => {
        console.error(err);
        setFilteredGoals([]);
        setGoalStats({});
      });
  }, []);

  useEffect(() => {
    api.get("/Review/GetPendingReview")
      .then((res) => {
        console.log("Fetched pending:", res.data);
      const reviewsWithId = res.data.flatMap((review: Review, index: number) =>
        review.reviewIds.map((reviewId) => ({
          id: `${reviewId}-${index}`,
          message: review.message,
          messageType: review.messageType,
          reviewId: reviewId, 
        }))
      );    
        setReviews(reviewsWithId);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Konvertovanie goalStats na dáta pre PieChart
  const pieData = Object.entries(goalStats).map(([status, count], index) => ({
    id: index,
    value: count,
    label: status,
    color: statusColors[status] || "#999999",
  }));

  const handleRowClickGoals = (params: any) => {
        nav('/employeeGoals');
  };
  const handleRowClickTasks = (params: any) => {
    const id = params.row.reviewId;
    const message = params.row.messageType;
    const reviewId = params.row.reviewId;
        console.log("Double-clicked task ID:", id); 
        if (!id) {
            console.warn("No ID found for this row:", params.row); 
            return;
        }
        if (message == 1) {
          nav(`/manageFeedback/`, { state: { reviewId } });
      } else {
          nav('/updateReviewZam', { state: { id } });
      }
    
};

  return (
    <Layout>
      <Box sx={{ paddingLeft: "180px", paddingTop: "20px",display: "flex", justifyContent: "left"}}>
        <Typography variant="h5">
          Vitajte doma {userProfile?.titleBefore} {userProfile?.firstName} {userProfile?.lastName} {userProfile?.titleAfter}
        </Typography>
      </Box>

      {/* Grid container pre tabuľky a graf */}
      <Grid container spacing={3} sx={{ paddingLeft: "150px", minWidth: "1350px", margin: "auto" }}>
        
        {/* Ľavý stĺpec s tabuľkami */}
        <Grid item xs={12} md={6}>
          <Card sx={{ marginBottom: "20px", background: "#008080", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Prebiehajúce úlohy</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                  height: 250, 
                  background: "#fff",
                  color: "#000",
                  marginTop: "10px",
                  overflowY: "auto", 
                }}
              >
                <DataGrid
                  rows={reviews}
                  columns={columnsTasks}
                  hideFooter
                  autoPageSize={true}
                  autoHeight={true} 
                  onRowClick={handleRowClickTasks}
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      display: "none",
                    },
                    "& .MuiDataGrid-cell": {
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflow: "visible",
                      lineHeight: "1.7",
                    },

                  }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ background: "#FFA500", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6">Prebiehajúce ciele</Typography>
              <Box sx={{ height: 200, background: "#fff", color: "#000", marginTop: "10px" }}>
                <DataGrid
                  rows={filteredGoals}
                  columns={columnsGoals}
                  hideFooter
                  autoHeight
                  onRowClick={handleRowClickGoals}
                  sx={{ "& .MuiDataGrid-columnHeaders": { display: "none" } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pravý stĺpec s grafom a legendou */}
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start", 
              width: "100%",
              height: 330,
              padding: "20px",
              border: "2px solid #008080", 
              borderRadius: "8px", 
              backgroundColor: "#f7f7f7", 
            }}
          >
            {/* Title */}
            <Typography variant="h5" sx={{ marginBottom: "16px" }}>
              Stav cieľov
            </Typography>

            {/* Container for PieChart and Legend aligned horizontally */}
            <Box
              sx={{
                display: "flex", // Align PieChart and legend side by side
                flexDirection: "row", // Horizontal layout for PieChart and Legend
                justifyContent: "flex-start", // Align to the left
                alignItems: "flex-start", // Align them at the top (no vertical centering)
                width: "100%", // Make sure it takes full width
              }}
            >
              {/* Render PieChart only if there is data */}
              {pieData.length > 0 && (
                <>
                  {/* PieChart */}
                  <PieChart
                    series={[
                      {
                        data: pieData,
                        innerRadius: 50,
                        outerRadius: 100,
                        paddingAngle: 3,
                        cornerRadius: 5,
                        startAngle: 0,
                        endAngle: 360,
                        arcLabel: (item) => `${item.value}`,
                        arcLabelMinAngle: 20,
                      },
                    ]}
                    slotProps={{
                      legend: { hidden: true },
                    }}
                    width={250}
                    height={250}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: { fontWeight: "bold", fill: "white" },
                    }}
                  />

                  {/* Legend next to the PieChart */}
                  <Box sx={{ marginLeft: "5px", textAlign: "left" }}>
                    <Typography variant="body1" fontWeight="bold">
                      Celkom: {totalGoals}
                    </Typography>
                    {pieData.map((item) => (
                      <Box key={item.id} sx={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: item.color,
                            borderRadius: "50%",
                            marginRight: "20px",
                          }}
                        />
                        <Typography variant="body2">
                          {item.label}: {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Grid>


      </Grid>
    </Layout>
  );
};

export default HomeScreen;
