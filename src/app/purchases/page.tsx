"use client";

import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Avatar,
  Chip,
  Divider,
  alpha,
  useTheme,
  Paper,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../(components)/Loading";
import ImageComp from "../(customMuiComp)/ImageComp";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface PurchaseItem {
  id: number;
  name: string;
  updatedAt?: string;
  createdAt?: string;
  category?: string | { id: string; label: string };
  price: number;
  stock: number;
  rating?: number;
  description: string;
  image?: string;
  count: number;
}

interface Purchase {
  purchaseId: string;
  purchasedAt: string;
  items: PurchaseItem[];
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  purchasedItems?: Purchase[];
}

export default function PurchasesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const uid = session?.user?.id;

  const {
    data: userData,
    isLoading,
    error,
    isError,
  } = useQuery<User>({
    queryKey: ["user-purchases", uid],
    queryFn: async () => {
      const res = await fetch(`/api/users/${uid}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      return res.json();
    },
    enabled: !!uid,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (isError || error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" align="center">
          Failed to load purchase history. Please try again later.
        </Typography>
      </Container>
    );
  }

  const purchases = userData?.purchasedItems || [];
  const totalOrders = purchases.length;
  const totalItems = purchases.reduce(
    (sum, purchase) =>
      sum + purchase.items.reduce((itemSum, item) => itemSum + item.count, 0),
    0
  );
  const totalSpent = purchases.reduce(
    (sum, purchase) =>
      sum +
      purchase.items.reduce(
        (itemSum, item) => itemSum + Number(item.price) * item.count,
        0
      ),
    0
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAccountDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh" }}>
      {/* User Information Card */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid
            item
            xs={12}
            sm={3}
            sx={{ display: "flex", justifyContent: "center" }}
            {...({} as any)}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: theme.palette.primary.main,
                fontSize: "3rem",
                fontWeight: "bold",
                boxShadow: 4,
              }}
            >
              {userData?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={9} {...({} as any)}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {userData?.name || "User"}
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon color="primary" />
                <Typography variant="body1" color="text.secondary">
                  {userData?.email || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon color="primary" />
                <Typography variant="body1" color="text.secondary">
                  Member since: {formatAccountDate(userData?.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Purchase Statistics */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} {...({} as any)}>
            <Card
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <ShoppingBagIcon
                sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }}
              />
              <Typography variant="h4" fontWeight="bold" color="primary">
                {totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} {...({} as any)}>
            <Card
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: alpha(theme.palette.success.main, 0.08),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <ShoppingBagIcon
                sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }}
              />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items Purchased
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} {...({} as any)}>
            <Card
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.08),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <AttachMoneyIcon
                sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }}
              />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                ${totalSpent.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Purchased Items Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ShoppingBagIcon color="primary" />
          Purchase History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {purchases.length === 0
            ? "You haven't made any purchases yet."
            : `You have ${purchases.length} purchase${
                purchases.length > 1 ? "s" : ""
              } in your history.`}
        </Typography>
      </Box>

      {purchases.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: alpha(theme.palette.grey[500], 0.05),
          }}
        >
          <ShoppingBagIcon
            sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No purchases yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start shopping to see your purchase history here!
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {purchases.map((purchase) => (
            <Paper
              key={purchase.purchaseId}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Order #{purchase.purchaseId}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(purchase.purchasedAt)}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${purchase.items.length} item${
                    purchase.items.length > 1 ? "s" : ""
                  }`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Grid container spacing={3}>
                {purchase.items.map((item) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={`${purchase.purchaseId}-${item.id}`}
                    {...({} as any)}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <ImageComp item={item} />
                        <Chip
                          label={`Qty: ${item.count}`}
                          color="primary"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            fontWeight: "bold",
                            boxShadow: 2,
                          }}
                        />
                      </Box>
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.description}
                        </Typography>
                        <Box
                          sx={{
                            mt: "auto",
                            pt: 2,
                            borderTop: `1px solid ${alpha(
                              theme.palette.divider,
                              0.5
                            )}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="primary"
                              fontWeight="bold"
                            >
                              ${(Number(item.price) * item.count).toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${Number(item.price).toFixed(2)} each
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}
