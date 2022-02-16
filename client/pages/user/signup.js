import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Input,
  Stack,
  Collapse,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(true);

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/users/signup", {
        email,
        password,
      });

      console.log(response.data);
    } catch (err) {
      setOpen(true);
      setErrors(err.response.data.errors);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box component="form" onSubmit={submitHandler}>
            <Stack direction="column" justifyContent="center" spacing={2}>
              <h1>Signup</h1>
              {errors.length > 0 && (
                <div>
                  {errors.map((err) => (
                    <Collapse in={open}>
                      <Alert
                        key={err.message}
                        severity="error"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setOpen(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                      >
                        {err.message}
                      </Alert>
                    </Collapse>
                  ))}
                </div>
              )}
              <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Email</InputLabel>
                <Input
                  id="component-simple"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl variant="standard">
                <InputLabel htmlFor="component-simple">Password</InputLabel>
                <Input
                  id="component-simple"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ backgroundColor: "blue" }}></Box>
        </Grid>
      </Grid>
    </>
  );
};

export default signup;
