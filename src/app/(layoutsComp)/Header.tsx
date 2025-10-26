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
import { useOrdersItem } from "../(store)/useOrdersStores";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { useProductsItem } from "../(store)/useProductsStore";
import { JSX, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSnackbar } from "../SnackbarProvider";
import { SnackbarSeverityEnum } from "../types/types";

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
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const { orders } = useOrdersItem();
  const { products, setFilteredProducts } = useProductsItem();

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
   * Navigates user to shopping cart page
   */
  const handleNavigateToCart = useCallback(() => {
    if (!session) {
      return showSnackbar(
        "please authenticate to proceed to shopping cart",
        SnackbarSeverityEnum.Error
      );
    }
    router.push("/cart");
  }, [router, session]);

  /**
   * Signs out the current user and redirects to home
   */
  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
  }, []);

  /**
   * Filters products based on search query
   * Searches through product names and descriptions
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSearchProducts = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value.toLowerCase().trim();

      if (!query) {
        setFilteredProducts(products);
        return;
      }

      const filtered = products.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const descriptionMatch = product.description
          .toLowerCase()
          .includes(query);
        return nameMatch || descriptionMatch;
      });

      setFilteredProducts(filtered);
    },
    [products, setFilteredProducts]
  );

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
        onClick={handleLogout}
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
        onChange={handleSearchProducts}
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
        color: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
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
        onClick={handleNavigateToCart}
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
          badgeContent={orders.length}
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
      {status === "loading" ? (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontStyle: "italic",
          }}
        >
          Loading...
        </Typography>
      ) : !session ? (
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
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            boxShadow: "0 3px 15px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          Login
        </Button>
      ) : (
        <Button
          onClick={handleLogout}
          variant="outlined"
          endIcon={<LogoutIcon />}
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
          Logout
        </Button>
      )}
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
