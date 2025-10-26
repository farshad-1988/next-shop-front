// "use client";

// import { useState, FormEvent, ChangeEvent } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Alert,
//   Container,
//   Link,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { AuthFormData, AuthResponse } from "@/app/types/types";
// import { useMutation } from "@tanstack/react-query";

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   maxWidth: 450,
//   margin: "0 auto",
//   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
//   borderRadius: theme.spacing(2),
// }));

// const StyledForm = styled("form")(({ theme }) => ({
//   width: "100%",
//   marginTop: theme.spacing(3),
// }));

// export default function AuthPage() {
//   const [isSignIn, setIsSignIn] = useState<boolean>(true);
//   const [formData, setFormData] = useState<AuthFormData>({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const router = useRouter();

//   const { mutate, isError, error, isPending } = useMutation({
//     mutationFn: async () => {
//       if (isSignIn) {
//         const res = await signIn("credentials", {
//           email: formData.email,
//           password: formData.password,
//           redirect: false,
//         });
//         return res;
//       } else {
//         const res = await fetch("/api/auth", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             action: isSignIn ? "signin" : "signup",
//             ...formData,
//           }),
//         });
//         const data: AuthResponse = await res.json();
//         if (!res.ok || !data.success) {
//           throw new Error("something went wrong!");
//         }
//         return { success: true, user: res.json() };
//       }
//     },
//     onSuccess: (data) => {
//       if (!data.success) {
//         return;
//       }
//       // Store user in localStorage (in production, use proper auth)
//       if (data.user) {
//         localStorage.setItem("user", JSON.stringify(data.user));
//         router.push("/dashboard");
//       }
//     },
//     onError(error) {
//       alert(error.message);
//       console.log(error);
//     },
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const toggleMode = () => {
//     setIsSignIn(!isSignIn);
//     setFormData({ name: "", email: "", password: "" });
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           py: 4,
//         }}
//       >
//         <StyledPaper elevation={6}>
//           <Typography
//             component="h1"
//             variant="h4"
//             sx={{
//               fontWeight: 700,
//               color: "primary.main",
//               mb: 1,
//             }}
//           >
//             {isSignIn ? "Welcome Back" : "Create Account"}
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{
//               color: "text.secondary",
//               mb: 2,
//             }}
//           >
//             {isSignIn
//               ? "Sign in to continue to your account"
//               : "Sign up to get started"}
//           </Typography>

//           <StyledForm onSubmit={() => mutate()}>
//             {!isSignIn && (
//               <TextField
//                 margin="normal"
//                 required={!isSignIn}
//                 fullWidth
//                 id="name"
//                 label="Full Name"
//                 name="name"
//                 autoComplete="name"
//                 autoFocus={!isSignIn}
//                 value={formData.name}
//                 onChange={handleChange}
//                 sx={{ mb: 2 }}
//               />
//             )}

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus={isSignIn}
//               value={formData.email}
//               onChange={handleChange}
//               sx={{ mb: 2 }}
//             />

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               value={formData.password}
//               onChange={handleChange}
//               sx={{ mb: 3 }}
//             />

//             {isError && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {error.message}
//               </Alert>
//             )}

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               disabled={isPending}
//               sx={{
//                 py: 1.5,
//                 fontSize: "1rem",
//                 fontWeight: 600,
//                 textTransform: "none",
//                 borderRadius: 2,
//                 background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
//                 boxShadow: "0 3px 15px rgba(102, 126, 234, 0.4)",
//                 "&:hover": {
//                   background:
//                     "linear-gradient(45deg, #5568d3 30%, #6a4093 90%)",
//                   boxShadow: "0 4px 20px rgba(102, 126, 234, 0.6)",
//                 },
//               }}
//             >
//               {isPending ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : isSignIn ? (
//                 "Sign In"
//               ) : (
//                 "Sign Up"
//               )}
//             </Button>

//             <Box sx={{ mt: 3, textAlign: "center" }}>
//               <Typography variant="body2" color="text.secondary">
//                 {isSignIn
//                   ? "Don't have an account? "
//                   : "Already have an account? "}
//                 <Link
//                   component="button"
//                   type="button"
//                   onClick={toggleMode}
//                   sx={{
//                     fontWeight: 600,
//                     textDecoration: "none",
//                     cursor: "pointer",
//                     "&:hover": {
//                       textDecoration: "underline",
//                     },
//                   }}
//                 >
//                   {isSignIn ? "Sign Up" : "Sign In"}
//                 </Link>
//               </Typography>
//             </Box>
//           </StyledForm>
//         </StyledPaper>
//       </Box>
//     </Container>
//   );
// }
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Container,
  Link,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";

// Type definitions
interface AuthFormData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

interface MutationResult {
  success: boolean;
  user?: User;
  error?: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: 450,
  margin: "0 auto",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.spacing(2),
}));

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(3),
}));

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const { mutate, isError, error, isPending } = useMutation<
    MutationResult,
    Error,
    void
  >({
    mutationFn: async (): Promise<MutationResult> => {
      if (isSignIn) {
        // Sign in with NextAuth
        const res: SignInResponse | undefined = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (!res) {
          throw new Error("Sign in failed - no response");
        }

        if (res.error) {
          throw new Error(res.error);
        }

        if (!res.ok) {
          throw new Error("Invalid credentials");
        }

        // Return success for sign in (NextAuth handles session)
        return { success: true };
      } else {
        // Sign up
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "signup",
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data: AuthResponse = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Sign up failed");
        }

        return {
          success: true,
          user: data.user,
        };
      }
    },
    onSuccess: async (data: MutationResult) => {
      if (!data.success) {
        return;
      }

      if (isSignIn) {
        // For sign in, just redirect (NextAuth handles the session)
        router.push("/");
      } else {
        // For sign up, automatically sign in the user
        if (data.user) {
          const signInRes = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
          });

          if (signInRes?.ok) {
            router.push("/");
          } else {
            throw new Error("Auto sign-in failed after registration");
          }
        }
      }
    },
    onError: (error: Error) => {
      console.error("Authentication error:", error);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    mutate();
  };

  const toggleMode = (): void => {
    setIsSignIn(!isSignIn);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 4,
        }}
      >
        <StyledPaper elevation={6}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 1,
            }}
          >
            {isSignIn ? "Welcome Back" : "Create Account"}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 2,
            }}
          >
            {isSignIn
              ? "Sign in to continue to your account"
              : "Sign up to get started"}
          </Typography>

          <StyledForm onSubmit={handleSubmit}>
            {!isSignIn && (
              <TextField
                margin="normal"
                required={!isSignIn}
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus={!isSignIn}
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus={isSignIn}
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={isSignIn ? "current-password" : "new-password"}
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            {isError && error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error.message}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isPending}
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                boxShadow: "0 3px 15px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #5568d3 30%, #6a4093 90%)",
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.6)",
                },
              }}
            >
              {isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : isSignIn ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {isSignIn
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Link
                  component="button"
                  type="button"
                  onClick={toggleMode}
                  sx={{
                    fontWeight: 600,
                    textDecoration: "none",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {isSignIn ? "Sign Up" : "Sign In"}
                </Link>
              </Typography>
            </Box>
          </StyledForm>
        </StyledPaper>
      </Box>
    </Container>
  );
}
