/* eslint-disable react/no-unescaped-entities */
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Link from 'next/link';
import logo from '../shared/images/logo-expense-guardian.png';
import Image from "next/image";

export default function Login() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });

    if (result?.error) {
      console.error(result.error); // Lidar com erros
    }
  };

  return (
    

    <Box
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#168F7A] to-[#383838]"
    >
      <Box
        className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <Image src={logo} alt="Logo" className="logo" />
        <Typography variant="h3" component="h1" className="text-center text-4xl font-semibold text-[#383838] mb-8">
          Welcome Back!
        </Typography>
        
        <Typography variant="body1" className="text-center text-lg text-[#383838] mb-4">
          Don't have an account yet? 
            <Link href={"#"} className="ps-2 text-[#168F7A] font-semibold hover:underline mt-4">
                Sign up
            </Link>
        </Typography>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <TextField
            name="email"
            type="email"
            id="user-email"
            label="Email"
            variant="outlined"
            required
            className="w-full"
            color="primary"
            inputProps={{
              style: { color: '#383838' }, // Cor do texto
            }}
          />
          <TextField
            name="password"
            type="password"
            id="user-password"
            label="Password"
            variant="outlined"
            required
            className="w-full"
            color="primary"
            inputProps={{
              style: { color: '#383838' }, // Cor do texto
            }}
          />

          <Box className="flex justify-between items-center">
            <Button variant="text" color="primary" className="text-sm">
              Forgot Password?
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full py-2 mt-4 text-lg"
              style={{ backgroundColor: "#168F7A" }}
            >
              Login
            </Button>
          </Box>

          <Divider className="my-4">OR</Divider>

          <Button
            variant="contained"
            color="secondary"
            className="w-full py-2 text-lg"
            style={{ backgroundColor: "#168F7A" }}
            endIcon={<RocketLaunchIcon />}
          >
            Sign up with Google
          </Button>
        </form>
      </Box>
    </Box>
  );
}
