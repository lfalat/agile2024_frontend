import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, TextField, Button, Stack } from "@mui/material";
import { Goal } from "./UpdateReviewZam";

type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
  employeeGoals: Goal[];
  selectedGoal: Goal | null;
  selectedEmployee: any | null;
  setSelectedGoal: React.Dispatch<React.SetStateAction<Goal | null>>;
  reviewData: any;
};

const ReviewModalZam: React.FC<ReviewModalProps> = ({ open, onClose, employeeGoals, selectedGoal, selectedEmployee, setSelectedGoal, reviewData}) => {

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleSuperiorDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedGoal) {
      setSelectedGoal({
        ...selectedGoal,
        superiorDescription: e.target.value,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {reviewData?.reviewName} - {selectedEmployee?.name || "Vybraný zamestnanec"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1"  sx={{ mb: 2 }}>
          Zadávateľ: {reviewData?.superiorName}
        </Typography>

        <Typography variant="body1"  sx={{ display: 'inline' }}>
          Posudzovaný cieľ: 
        </Typography>

        {employeeGoals.length ? (
          <Typography variant="body1" sx={{ display: 'inline', ml: 1 }}>
            {employeeGoals.map((goal, index) => (
              <span
                key={goal.goalId}
                onClick={() => handleGoalClick(goal)}
                style={{
                  cursor: 'pointer',
                  color: selectedGoal === goal ? '#000000' : '#B0BEC5',
                  textDecoration: 'underline',
                  marginRight: index < employeeGoals.length - 1 ? 8 : 0,
                }}
              >
                {goal.goalName}, 
              </span>
            ))}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ display: 'inline', ml: 1 }}>
            Žiadne ciele nie sú priradené tomuto zamestnancovi.
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#ffffff',  color: '#000000',  '&:hover': { backgroundColor: '#0097A7' }, '&:active': { boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', transform: 'translateY(2px)', }, marginRight: 2 }}
                onClick={() => console.log("Posudzovany Ciel")}
                >
                Posudzovany Ciel
            </Button>
            <Button
                variant="contained"
                sx={{backgroundColor: '#ffffff', color: '#000000', '&:hover': { backgroundColor: '#0097A7' },'&:active': {boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',transform: 'translateY(2px)',}}}
                  onClick={() => console.log("Dodatocne Otazky")}
                    >
                Dodatocne Otazky
              </Button>
        </Box>
        <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
          Poprosím o vyjadrenie k cieľu: {reviewData?.goals?.[0]}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Vyjadrenie zamestnanca"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={selectedGoal?.employeeDescription || ""}
            sx={{ mb: 2 }}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Vyjadrenie vedúceho zamestnanca"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={selectedGoal?.superiorDescription || ""}
            sx={{ mb: 2 }}
            onChange={handleSuperiorDescriptionChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
        <Stack direction="row" gap={3}>
        <Button
          variant="contained"
          type="submit"
          sx={{
              backgroundColor: '#D2691E',
              '&:hover': { backgroundColor: '#FB8C00' },
              color: 'white',
              padding: '8px 16px',
          }}
          >
          Odoslať
        </Button>                                                  
          <Button variant="contained" onClick={onClose}
              sx={{ backgroundColor: '#B0BEC5', '&:hover': { backgroundColor: '#90A4AE' }, color: 'white', padding: '8px 16px',}}
            >
              Zrušiť
          </Button>            
          </Stack>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModalZam;


// <Button variant="contained" onClick={() => onSave(selectedGoal?.superiorDescription || "")}
//sx={{ backgroundColor: '#008B8B', '&:hover': { backgroundColor: '#0097A7' },color: 'white',padding: '8px 16px',}}
//>
//  Uložiť
//</Button>