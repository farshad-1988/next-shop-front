"use client";

import {
  AutocompleteElement,
  FormContainer,
  TextFieldElement,
} from "react-hook-form-mui";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { use } from "react";
import { useProductsItem } from "@/app/(store)/useProductsStore";
import { useRouter } from "next/navigation";

import { SnackbarSeverityEnum, UserRole } from "@/app/types/types";
import { useSession } from "next-auth/react";
import { useSnackbar } from "@/app/(store)/useSnackbarStore";

// Type definitions
interface Product {
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  price: string;
  category: string;
  stock: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Furniture",
  "Toys",
  "Groceries",
  "Beauty",
  "Sports",
  "Automotive",
  "Garden",
] as const;

// URL validation regex
const URL_PATTERN =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

export default function HandleItemPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { data: session } = useSession();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id ?? "";
  const { increaseProductsItem } = useProductsItem();
  const addProduct = useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (!session || session.user.role !== UserRole.ADMIN)
        throw new Error("you are not authorized");
      const endpoint = id
        ? `/api/products/${id}`
        : "/api/products";

      const method = id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }
      const addedItem = await res.json();
      return { item: addedItem, method };
    },
    onSuccess: ({ item, method }) => {
      increaseProductsItem(item);
      const message =
        method === "POST"
          ? `item ${item.name} added successfully`
          : `you edit item ${item.name} successfully`;
      showSnackbar(message, SnackbarSeverityEnum.Success);
      router.push("/admin");
    },
    onError: (error) => {
      showSnackbar(error.message, SnackbarSeverityEnum.Error);
    },
  });

  const { data: item, isLoading } = useQuery<Product>({
    queryKey: ["item", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }
      return res.json();
    },
    enabled: !!id,
  });

  const handleSubmit = async (data: ProductFormData) => {
    await addProduct.mutate(data);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 6,
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
            textAlign: "center",
          }}
        >
          {id ? "Edit Product" : "Add New Product"}
        </Typography>

        <FormContainer
          defaultValues={{
            createdAt: dayjs().toISOString(),
            updatedAt: dayjs().toISOString(),
            name: item?.name || "",
            price: item?.price?.toString() || "",
            category: item?.category || "",
            stock: item?.stock?.toString() || "",
            description: item?.description || "",
            image: item?.image || "",
          }}
          onSuccess={handleSubmit}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextFieldElement
              name="name"
              label="Product Name"
              rules={{
                pattern: {
                  value: /^[\p{L}\p{N}\p{Zs}\-_\.,]*$/gmu,
                  message:
                    "Only letters, numbers, spaces, dots, commas, dashes, and underscores are permitted.",
                },
              }}
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />

            <TextFieldElement
              name="price"
              label="Price ($)"
              type="number"
              required
              fullWidth
              rules={{
                min: {
                  value: 0,
                  message: "Price must be greater than or equal to 0",
                },
                pattern: {
                  value: /^[0-9]*\.?[0-9]+$/,
                  message: "Only numeric values are allowed",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />

            <AutocompleteElement
              name="category"
              label="Category"
              options={CATEGORIES as unknown as string[]}
              autocompleteProps={{
                freeSolo: true,
                autoSelect: true,
                selectOnFocus: true,
              }}
              required
              textFieldProps={{
                fullWidth: true,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                },
              }}
            />

            <TextFieldElement
              name="stock"
              label="Stock Quantity"
              type="number"
              required
              fullWidth
              rules={{
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Only whole numbers are allowed",
                },
                min: {
                  value: 0,
                  message: "Stock must be greater than or equal to 0",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />

            <TextFieldElement
              name="description"
              label="Description"
              multiline
              rows={4}
              fullWidth
              rules={{
                pattern: {
                  value: /^[\p{L}\p{N}\p{Zs}\-_\.,]*$/gmu,
                  message:
                    "Only letters, numbers, spaces, dots, commas, dashes, and underscores are permitted.",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />

            <TextFieldElement
              name="image"
              label="Image URL"
              fullWidth
              required
              rules={{
                pattern: {
                  value: URL_PATTERN,
                  message:
                    "Please enter a valid URL (e.g., https://example.com/image.jpg)",
                },
              }}
              placeholder="https://example.com/product-image.jpg"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
              }}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={addProduct.isPending}
              sx={{
                mt: 2,
                py: 1.5,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #63408b 100%)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                },
                "&:disabled": {
                  background: "linear-gradient(135deg, #ccc 0%, #999 100%)",
                },
              }}
            >
              {addProduct.isPending ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : id ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </Box>
        </FormContainer>
      </Paper>
    </Box>
  );
}
