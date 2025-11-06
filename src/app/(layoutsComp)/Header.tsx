"use client";

import {
  AppBar,
  Badge,
  Button,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
  Box,
  Container,
  alpha,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useOrdersItem } from "../(store)/useOrdersStores";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useProductsItem } from "../(store)/useProductsStore";
import { JSX, useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { SnackbarSeverityEnum } from "../types/types";
import { useSnackbar } from "../(store)/useSnackbarStore";
import ClearIcon from "@mui/icons-material/Clear";

/**
 * Header Component
 *
 * A professional, responsive navigation header for an e-commerce application.
 * Adapts based on user authentication state, screen size, and current route.
 *
 * @component
 * @example
 * ```tsx
 * <Header />
 * ```
 *
 * @description
 * Features:
 * - Fully responsive design with mobile drawer menu
 * - Admin view: Quick access to add products and logout
 * - User view: Product search, shopping cart, and authentication controls
 * - Displays cart item count badge
 * - Real-time search filtering for products
 * - Professional styling with smooth transitions
 *
 * @returns {JSX.Element} Rendered header component
 */
const Header = (): JSX.Element => {
  const { setProductSearch, setPagination } = useProductsItem();
  const [searchText, setSearchText] = useState<string>("");
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { orders } = useOrdersItem();

  /** Determines if current route is within admin section */
  const isAdmin = pathname.startsWith("/admin");

  /** Determines if current route is the home page */
  const isHomePage = pathname === "/";

  /**
   * Toggles mobile menu drawer
   */
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  /**
   * Closes mobile menu drawer
   */
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  /**
   * Navigates user to authentication page
   */
  const handleLogin = useCallback(() => {
    router.push("/auth");
    closeMobileMenu();
  }, [router, closeMobileMenu]);

  /**
   * Navigates admin to add new product page
   */
  const handleAddNewProduct = useCallback(() => {
    router.push("/admin/handleItem");
    closeMobileMenu();
  }, [router, closeMobileMenu]);

  /**
   * Navigates user to shopping cart page
   */
  const handleNavigateToCart = useCallback(() => {
    if (!session) {
      showSnackbar(
        "Please authenticate to proceed to shopping cart",
        SnackbarSeverityEnum.Error
      );
      return;
    }
    router.push("/cart");
    closeMobileMenu();
  }, [router, session, showSnackbar, closeMobileMenu]);

  /**
   * Navigates user to purchases page
   */
  const handleNavigateToPurchases = useCallback(() => {
    if (!session) {
      showSnackbar(
        "Please authenticate to view your purchases",
        SnackbarSeverityEnum.Error
      );
      return;
    }
    router.push("/purchases");
    closeMobileMenu();
  }, [router, session, showSnackbar, closeMobileMenu]);

  /**
   * Signs out the current user and redirects to home
   */
  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
    useOrdersItem.persist.clearStorage();
    closeMobileMenu();
  }, [closeMobileMenu]);

  /**
   * Filters products based on search query
   * Searches through product names and descriptions
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSearchProducts = useCallback(async () => {
    setProductSearch(searchText);
  }, [searchText, setProductSearch]);

  /**
   * Renders the brand logo
   */
  const renderLogo = (): JSX.Element => (
    <Box
      component={Link}
      href="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        textDecoration: "none",
        color: "inherit",
        transition: "opacity 0.2s ease",
        "&:hover": {
          opacity: 0.8,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
        }}
      >
        <StorefrontIcon sx={{ color: "white", fontSize: 24 }} />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: { xs: "none", sm: "block" },
          letterSpacing: "-0.5px",
        }}
      >
        ShopHub
      </Typography>
    </Box>
  );

  /**
   * Renders the search bar component
   */

  const renderSearchBar = (): JSX.Element => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setPagination(false);
        setProductSearch(searchText);
        handleSearchProducts();
      }}
      style={{ width: "100%", maxWidth: 500 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: "6px 12px",
          display: "flex",
          alignItems: "center",
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: alpha(theme.palette.background.default, 0.6),
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.3),
            backgroundColor: alpha(theme.palette.background.default, 0.9),
          },
          "&:focus-within": {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            fontSize: "0.95rem",
            "& input::placeholder": {
              opacity: 0.7,
            },
          }}
          placeholder="Search products..."
          inputProps={{ "aria-label": "search products" }}
          value={searchText}
          onChange={(e) => {
            if (e.target.value === "") {
              setProductSearch("");
              setPagination(false);
            }
            setSearchText(e.target.value);
          }}
          endAdornment={
            <>
              {searchText && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setProductSearch("");
                    setSearchText("");
                  }}
                  aria-label="clear search"
                  sx={{ mr: 1 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </>
          }
        />
        <IconButton
          type="submit"
          aria-label="search"
          sx={{ color: "text.secondary" }}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </form>
  );

  /**
   * Renders the admin-specific header layout
   */
  const renderAdminHeader = (): JSX.Element => (
    <>
      {renderLogo()}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          ml: "auto",
        }}
      >
        {!isMobile ? (
          <>
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Add Product
            </Button>

            <Button
              variant="outlined"
              endIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                borderWidth: 1.5,
                borderColor: alpha(theme.palette.error.main, 0.5),
                color: theme.palette.error.main,
                "&:hover": {
                  borderWidth: 1.5,
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                  borderColor: theme.palette.error.main,
                },
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <IconButton
            onClick={toggleMobileMenu}
            sx={{
              color: "text.primary",
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>
    </>
  );

  /**
   * Renders the user action controls (cart and auth buttons)
   */
  const renderUserActions = (): JSX.Element => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 2 },
      }}
    >
      {session?.user.role === "admin" ? (
        <Button
          component={Link}
          href="/admin"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            py: 1,
            borderRadius: 2,
            borderWidth: 1.5,
            display: { xs: "none", sm: "flex" },
            "&:hover": {
              borderWidth: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          Admin Panel
        </Button>
      ) : (
        <>
          {/* Shopping Cart Button */}
          <IconButton
            onClick={handleNavigateToCart}
            aria-label="shopping cart"
            sx={{
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: "scale(1.05)",
              },
            }}
          >
            <Badge
              badgeContent={orders?.length}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontWeight: 700,
                  fontSize: "0.7rem",
                },
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 24 }} />
            </Badge>
          </IconButton>

          {/* Purchases Button */}
          {session && (
            <IconButton
              onClick={handleNavigateToPurchases}
              aria-label="purchases"
              sx={{
                borderRadius: 2,
                transition: "all 0.2s ease",
                display: { xs: "none", sm: "flex" },
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: "scale(1.05)",
                },
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 24 }} />
            </IconButton>
          )}
        </>
      )}

      {/* Authentication Button */}
      {status === "loading" ? (
        <Box
          sx={{
            px: 2,
            display: { xs: "none", sm: "block" },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            Loading...
          </Typography>
        </Box>
      ) : !session ? (
        <Button
          onClick={handleLogin}
          variant="contained"
          endIcon={<LoginIcon sx={{ display: { xs: "none", sm: "block" } }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            py: 1,
            borderRadius: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Login / Register
        </Button>
      ) : (
        <Button
          onClick={handleLogout}
          variant="outlined"
          endIcon={<LogoutIcon sx={{ display: { xs: "none", sm: "block" } }} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            py: 1,
            borderRadius: 2,
            borderWidth: 1.5,
            borderColor: alpha(theme.palette.error.main, 0.5),
            color: theme.palette.error.main,
            display: { xs: "none", sm: "flex" },
            "&:hover": {
              borderWidth: 1.5,
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              borderColor: theme.palette.error.main,
            },
          }}
        >
          Logout
        </Button>
      )}

      {/* Mobile Menu Button */}
      {!isAdmin && isMobile && (
        <IconButton
          onClick={toggleMobileMenu}
          sx={{
            ml: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </Box>
  );

  /**
   * Renders mobile navigation drawer
   */
  const renderMobileDrawer = (): JSX.Element => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={closeMobileMenu}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Menu
          </Typography>
          <IconButton onClick={closeMobileMenu} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
      </Box>

      <List sx={{ px: 1 }}>
        {isAdmin ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleAddNewProduct}
                sx={{ borderRadius: 2, mb: 1 }}
              >
                <ListItemIcon>
                  <AddIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Add Product" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            {!isHomePage && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/"
                  onClick={closeMobileMenu}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon>
                    <HomeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
            )}

            {session?.user.role === "admin" && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/admin"
                  onClick={closeMobileMenu}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon>
                    <StorefrontIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Admin Panel" />
                </ListItemButton>
              </ListItem>
            )}

            {session?.user.role !== "admin" && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleNavigateToCart}
                    sx={{ borderRadius: 2, mb: 1 }}
                  >
                    <ListItemIcon>
                      <Badge badgeContent={orders?.length} color="error">
                        <ShoppingCartIcon color="primary" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Shopping Cart" />
                  </ListItemButton>
                </ListItem>

                {session && (
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={handleNavigateToPurchases}
                      sx={{ borderRadius: 2, mb: 1 }}
                    >
                      <ListItemIcon>
                        <ShoppingBagIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="My Purchases" />
                    </ListItemButton>
                  </ListItem>
                )}
              </>
            )}

            <Divider sx={{ my: 2 }} />

            {session ? (
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <LogoutIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogin} sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <LoginIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          color: "text.primary",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              py: { xs: 1.5, sm: 2 },
              px: { xs: 0, sm: 2 },
              minHeight: { xs: 64, sm: 70 },
            }}
          >
            {isAdmin ? (
              renderAdminHeader()
            ) : (
              <>
                {renderLogo()}
                {isHomePage && !isMobile && (
                  <Box sx={{ flex: 1, mx: 4, maxWidth: 500 }}>
                    {renderSearchBar()}
                  </Box>
                )}
                {renderUserActions()}
              </>
            )}
          </Toolbar>

          {/* Mobile Search Bar */}
          {isHomePage && isMobile && !isAdmin && (
            <Box sx={{ pb: 2, px: 0 }}>{renderSearchBar()}</Box>
          )}
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      {renderMobileDrawer()}
    </>
  );
};

export default Header;
