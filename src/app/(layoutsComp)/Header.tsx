"use client";

import {
  AppBar,
  Badge,
  Button,
  Card,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
  Box,
  Container,
  alpha,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { JSX, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Header Component
 *
 * A responsive navigation header that adapts based on user authentication state
 * and current route. Provides different interfaces for admin and regular users.
 *
 * @component
 * @example
 * ```tsx
 * <Header />
 * ```
 *
 * @description
 * Features:
 * - Admin view: Quick access to add products and logout
 * - User view: Product search, shopping cart, and authentication controls
 * - Displays cart item count badge
 * - Real-time search filtering for products
 * - Responsive layout with max-width container
 *
 * @returns {JSX.Element} Rendered header component
 */
const Header = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  /** Determines if current route is within admin section */
  const isAdmin = pathname.startsWith("/admin");

  /** Determines if current route is the home page */
  const isHomePage = pathname === "/";

  /**
   * Navigates user to authentication page
   */
  const handleLogin = useCallback(() => {
    router.push("/auth");
  }, [router]);

  /**
   * Navigates admin to add new product page
   */
  const handleAddNewProduct = useCallback(() => {
    router.push("/admin/handleItem");
  }, [router]);

  /**
   * Renders the admin-specific header layout
   */
  const renderAdminHeader = (): JSX.Element => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddNewProduct}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          py: 1,
          borderRadius: 2,
          boxShadow: 2,
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        Add New Product
      </Button>

      <Button
        variant="outlined"
        endIcon={<LogoutIcon />}
        // onClick={handleLogout}
        color="error"
        sx={{
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          py: 1,
          borderRadius: 2,
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: alpha(theme.palette.error.main, 0.08),
          },
        }}
      >
        Log Out
      </Button>
    </Box>
  );

  /**
   * Renders the search bar component
   */
  const renderSearchBar = (): JSX.Element => (
    <Paper
      elevation={2}
      sx={{
        p: "4px 8px",
        display: "flex",
        alignItems: "center",
        width: { xs: "100%", sm: 350 },
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 4,
        },
        "&:focus-within": {
          boxShadow: 6,
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        },
      }}
    >
      <SearchIcon sx={{ color: "text.secondary", ml: 1 }} />
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          fontSize: "0.95rem",
        }}
        placeholder="Search for products..."
        inputProps={{ "aria-label": "search products" }}
        // onChange={handleSearchProducts}
      />
    </Paper>
  );

  /**
   * Renders the home navigation button
   */
  const renderHomeButton = (): JSX.Element => (
    <Button
      component={Link}
      href="/"
      startIcon={<HomeIcon />}
      variant="outlined"
      sx={{
        textTransform: "none",
        fontWeight: 600,
        px: 2,
        py: 1,
        borderRadius: 2,
        borderWidth: 2,
        "&:hover": {
          borderWidth: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
      }}
    >
      Home
    </Button>
  );

  /**
   * Renders the user action controls (cart and auth buttons)
   */
  const renderUserActions = (): JSX.Element => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Shopping Cart Button */}
      <IconButton
        // onClick={handleNavigateToCart}
        color="primary"
        aria-label="shopping cart"
        sx={{
          borderRadius: 2,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            transform: "scale(1.05)",
          },
        }}
      >
        <Badge
          // badgeContent={orders.length}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontWeight: 700,
            },
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      {/* Authentication Button */}

      <Button
        onClick={handleLogin}
        variant="contained"
        endIcon={<LoginIcon />}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          py: 1,
          borderRadius: 2,
          boxShadow: 2,
          "&:hover": {
            boxShadow: 4,
          },
        }}
      >
        Login
      </Button>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            justifyContent: "space-between",
            py: 1.5,
            px: { xs: 1, sm: 2 },
          }}
        >
          {isAdmin ? (
            renderAdminHeader()
          ) : (
            <>
              {isHomePage ? renderSearchBar() : renderHomeButton()}
              {renderUserActions()}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
