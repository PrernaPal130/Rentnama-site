"use client";

import { useEffect, useMemo, useState } from "react";
import { AppDataProvider } from "./myContext";
import {
  deletePublicProductFromFirestore,
  firebaseReady,
  loadCustomerDataFromFirestore,
  loadPublicProductsFromFirestore,
  loadVendorDataFromFirestore,
  savePublicProductToFirestore,
  saveCustomerDataToFirestore,
  saveVendorDataToFirestore,
} from "../lib/firebase";
import { useAuthData } from "./authContext";

const STORAGE_KEY = "rentnama-app-data";
const LOCAL_STORAGE_SAVE_DELAY = 300;
const FIRESTORE_SAVE_DELAY = 700;

const emptyCustomerData = {
  cart: [],
  wishlist: [],
  addresses: [],
  orders: [],
};

function mapVendorListingToProduct(listing) {
  return {
    id: listing.id,
    name: listing.name,
    subtitle: `${listing.category} rental`,
    description: listing.description,
    image: listing.image || "/lengha.jpg",
    gallery: [listing.image || "/lengha.jpg"],
    price: Number(listing.price) || 0,
    originalPrice: Math.round((Number(listing.price) || 0) * 2.1),
    securityDeposit: Number(listing.securityDeposit) || 0,
    sizeOptions: listing.sizes?.length ? listing.sizes : ["Free Size"],
    defaultSize: listing.sizes?.[0] || "Free Size",
    rentalDates: listing.availability || "Choose your rental dates",
    reviewBullets: [
      "Freshly added by a vendor partner",
      "Now available to rent on RentNama",
    ],
    shopName: listing.shopName || listing.businessName || "Verified Partner Shop",
    storeLocation: listing.storeLocation || "Partner boutique location",
    offlineVisitAvailable: true,
    subscriptionPlan: listing.subscriptionPlan || "Growth",
    onlineCommissionRate: listing.onlineCommissionRate || 18,
    ownerId: listing.ownerId || null,
    source: "vendor",
  };
}

function buildPublicCatalogProducts(baseProducts, publicProducts) {
  const mergedProducts = [...baseProducts];
  const existingIds = new Set(baseProducts.map((product) => product.id));

  publicProducts.forEach((product) => {
    if (!existingIds.has(product.id)) {
      mergedProducts.push(product);
    }
  });

  return mergedProducts;
}

const defaultData = {
  products: [
    {
      id: "PROD-001",
      name: "Manish Malhotra Lehenga",
      subtitle: "Red sequin lehenga set",
      description:
        "Step into elegance with this stunning red lehenga. Features fine sequin embellishments and embroidered dupatta detailing.",
      image: "/lengha.jpg",
      gallery: ["/lengha.jpg", "/lengha.jpg", "/lengha.jpg", "/lengha.jpg"],
      price: 8000,
      originalPrice: 17000,
      securityDeposit: 5000,
      sizeOptions: ["S", "M", "L", "XL"],
      defaultSize: "L",
      rentalDates: "26/05/25 to 31/05/25",
      reviewBullets: ["such a nice piece", "absolutely loved it!"],
      shopName: "Apna Closet Signature Studio",
      storeLocation: "Sector 17, Chandigarh",
      offlineVisitAvailable: true,
      subscriptionPlan: "Elite",
      onlineCommissionRate: 18,
      storeContact: "+91 98765 43210",
      storeHours: "11:00 AM - 8:00 PM",
      offlineOrderNote:
        "Visit the boutique for fabric inspection, styling assistance, and offline booking support.",
    },
    {
      id: "PROD-002",
      name: "Sabyasachi Saree",
      subtitle: "Hand embroidered festive saree",
      description: "A timeless festive saree with rich detailing.",
      image: "/sareemain.png",
      gallery: ["/sareemain.png"],
      price: 4800,
      originalPrice: 9800,
      securityDeposit: 3000,
      sizeOptions: ["Free Size"],
      defaultSize: "Free Size",
      rentalDates: "02/04/25 to 05/04/25",
      reviewBullets: ["perfect for wedding functions"],
      shopName: "Saree Galleria Kolkata",
      storeLocation: "Ballygunge, Kolkata",
      offlineVisitAvailable: true,
      subscriptionPlan: "Growth",
      onlineCommissionRate: 18,
      storeContact: "+91 98300 11223",
      storeHours: "10:30 AM - 7:30 PM",
      offlineOrderNote:
        "Book an in-store drape trial and place your saree rental or offline purchase order directly with the store team.",
    },
    {
      id: "PROD-003",
      name: "Ivory Sherwani Set",
      subtitle: "Classic embroidered sherwani",
      description: "Elegant sherwani for engagement and reception looks.",
      image: "/Sherwanimain.png",
      gallery: ["/Sherwanimain.png"],
      price: 6500,
      originalPrice: 12000,
      securityDeposit: 4000,
      sizeOptions: ["M", "L", "XL"],
      defaultSize: "L",
      rentalDates: "14/06/25 to 18/06/25",
      reviewBullets: ["looked premium in person"],
      shopName: "Tasva Occasion House",
      storeLocation: "South Extension, Delhi",
      offlineVisitAvailable: true,
      subscriptionPlan: "Growth",
      onlineCommissionRate: 18,
      storeContact: "+91 98110 22446",
      storeHours: "11:00 AM - 9:00 PM",
      offlineOrderNote:
        "Visit the store for fitting support, styling consultation, and offline sherwani booking.",
    },
  ],
  ...emptyCustomerData,
  publicProducts: [],
  vendorListings: [
    {
      id: "LIST-101",
      name: "Ivory Embroidered Lehenga",
      category: "Lehenga",
      image: "/lengha.jpg",
      price: 8000,
      securityDeposit: 5000,
      availability: "Available for 12 upcoming dates",
      status: "Live",
      tags: ["Bridal", "Handwork", "Premium"],
      sizes: ["S", "M", "L", "XL"],
      description: "Elegant bridal lehenga with detailed embroidery and premium finish.",
      shopName: "Apna Closet Chandigarh",
      storeLocation: "Sector 8, Chandigarh",
      subscriptionPlan: "Elite",
      onlineCommissionRate: 18,
      storeContact: "+91 98765 43210",
      storeHours: "11:00 AM - 8:00 PM",
      offlineOrderNote:
        "Visit the boutique for fabric inspection, styling assistance, and offline booking support.",
      blockedRanges: [
        { from: "2026-04-03", to: "2026-04-05" },
        { from: "2026-04-18", to: "2026-04-20" },
      ],
      bookedDates: ["2026-04-06", "2026-04-12", "2026-04-24"],
    },
    {
      id: "LIST-102",
      name: "Sabyasachi Saree",
      category: "Saree",
      image: "/sareemain.png",
      price: 4800,
      securityDeposit: 3000,
      availability: "Booked this weekend",
      status: "Limited",
      tags: ["Festive", "Saree", "Designer"],
      sizes: ["Free Size"],
      description: "Festive saree designed for elegant wedding and reception styling.",
      shopName: "Sabyasachi Rental House",
      storeLocation: "Ballygunge, Kolkata",
      subscriptionPlan: "Growth",
      onlineCommissionRate: 18,
      storeContact: "+91 98300 11223",
      storeHours: "10:30 AM - 7:30 PM",
      offlineOrderNote:
        "Book an in-store drape trial and place your saree rental or offline purchase order directly with the store team.",
      blockedRanges: [{ from: "2026-04-10", to: "2026-04-11" }],
      bookedDates: ["2026-04-04", "2026-04-16", "2026-04-21"],
    },
    {
      id: "LIST-103",
      name: "Classic Sherwani Set",
      category: "Sherwani",
      image: "/Sherwanimain.png",
      price: 6500,
      securityDeposit: 4000,
      availability: "Ready for dispatch",
      status: "Live",
      tags: ["Menswear", "Wedding", "Classic"],
      sizes: ["M", "L", "XL"],
      description: "Classic sherwani set for weddings, engagements, and formal events.",
      shopName: "Tasva Studio Delhi",
      storeLocation: "South Extension, Delhi",
      subscriptionPlan: "Growth",
      onlineCommissionRate: 18,
      storeContact: "+91 98110 22446",
      storeHours: "11:00 AM - 9:00 PM",
      offlineOrderNote:
        "Visit the store for fitting support, styling consultation, and offline sherwani booking.",
      blockedRanges: [{ from: "2026-04-18", to: "2026-04-20" }],
      bookedDates: ["2026-04-08", "2026-04-14", "2026-04-27"],
    },
  ],
  vendorBookings: [
    {
      id: "BOOK-901",
      customer: "Aarohi Mehta",
      item: "Ivory Embroidered Lehenga",
      listingId: "LIST-101",
      from: "2026-03-28",
      to: "2026-03-31",
      rentalDates: "28 Mar 2026 - 31 Mar 2026",
      status: "Pending",
      amount: 8000,
      visitLead: true,
    },
    {
      id: "BOOK-887",
      customer: "Riya Khanna",
      item: "Sabyasachi Saree",
      listingId: "LIST-102",
      from: "2026-03-30",
      to: "2026-04-02",
      rentalDates: "30 Mar 2026 - 2 Apr 2026",
      status: "Accepted",
      amount: 4800,
      visitLead: false,
    },
    {
      id: "BOOK-873",
      customer: "Ishita Jain",
      item: "Classic Sherwani Set",
      listingId: "LIST-103",
      from: "2026-04-03",
      to: "2026-04-06",
      rentalDates: "3 Apr 2026 - 6 Apr 2026",
      status: "Ready",
      amount: 6500,
      visitLead: true,
    },
  ],
  vendorReturns: [
    {
      id: "RET-301",
      item: "Ivory Embroidered Lehenga",
      listingId: "LIST-101",
      customer: "Aarohi Mehta",
      pickup: "1 Apr 2026",
      inspection: "Pending quality check",
      deposit: "Hold Rs. 5,000",
    },
    {
      id: "RET-294",
      item: "Sabyasachi Saree",
      listingId: "LIST-102",
      customer: "Riya Khanna",
      pickup: "3 Apr 2026",
      inspection: "Approved",
      deposit: "Refund initiated",
    },
    {
      id: "RET-288",
      item: "Classic Sherwani Set",
      listingId: "LIST-103",
      customer: "Ishita Jain",
      pickup: "6 Apr 2026",
      inspection: "Damage review",
      deposit: "Under review",
    },
  ],
};

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function makeOrderId() {
  return `RN-${Date.now().toString().slice(-6)}`;
}

function formatOrderDate(date = new Date()) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toIsoDate(value) {
  const date = new Date(`${value}T00:00:00`);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function expandDateRange(from, to) {
  if (!from || !to) {
    return [];
  }

  const dates = [];
  const currentDate = new Date(`${from}T00:00:00`);
  const endDate = new Date(`${to}T00:00:00`);

  while (currentDate <= endDate) {
    dates.push(toIsoDate(currentDate.toISOString().slice(0, 10)));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function deriveBookedDatesForListing(bookings, listingId) {
  return bookings
    .filter(
      (booking) =>
        booking.listingId === listingId &&
        ["Accepted", "Ready", "Picked Up"].includes(booking.status)
    )
    .flatMap((booking) => expandDateRange(booking.from, booking.to));
}

export default function MyState({ children }) {
  const { currentUser, profile, authLoading } = useAuthData();
  const [data, setData] = useState(defaultData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function hydrateStore() {
      try {
        const storedData = window.localStorage.getItem(STORAGE_KEY);
        const publicProducts = firebaseReady
          ? await loadPublicProductsFromFirestore()
          : [];
        const baseState = {
          ...defaultData,
          ...emptyCustomerData,
          publicProducts,
        };

        if (!currentUser && storedData) {
          setData({ ...baseState, ...JSON.parse(storedData) });
          return;
        }

        if (firebaseReady && currentUser?.uid) {
          const [remoteCustomerData, remoteVendorData] = await Promise.all([
            loadCustomerDataFromFirestore(currentUser.uid),
            profile?.role === "vendor"
              ? loadVendorDataFromFirestore(currentUser.uid)
              : Promise.resolve(null),
          ]);

          setData({
            ...baseState,
            ...(remoteCustomerData || {}),
            ...(remoteVendorData || {}),
          });
          return;
        }

        setData(baseState);
      } catch (error) {
        console.error("Failed to load shared app data", error);
      } finally {
        setIsHydrated(true);
      }
    }

    if (authLoading) {
      return;
    }

    setIsHydrated(false);
    hydrateStore();
  }, [authLoading, currentUser, profile]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (!currentUser) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    }, LOCAL_STORAGE_SAVE_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [currentUser, data, isHydrated]);

  useEffect(() => {
    if (!isHydrated || !firebaseReady || !currentUser?.uid) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveCustomerDataToFirestore(currentUser.uid, {
        cart: data.cart,
        wishlist: data.wishlist,
        addresses: data.addresses,
        orders: data.orders,
      });

      if (profile?.role === "vendor") {
        saveVendorDataToFirestore(currentUser.uid, {
          vendorListings: data.vendorListings,
          vendorBookings: data.vendorBookings,
          vendorReturns: data.vendorReturns,
        });
      }
    }, FIRESTORE_SAVE_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [
    currentUser,
    data.addresses,
    data.cart,
    data.orders,
    data.vendorBookings,
    data.vendorListings,
    data.vendorReturns,
    data.wishlist,
    isHydrated,
    profile,
  ]);

  const catalogProducts = useMemo(
    () => buildPublicCatalogProducts(data.products, data.publicProducts),
    [data.products, data.publicProducts]
  );

  const productsById = useMemo(
    () =>
      catalogProducts.reduce((accumulator, product) => {
        accumulator[product.id] = product;
        return accumulator;
      }, {}),
    [catalogProducts]
  );

  function addAddress(addressInput) {
    const newAddress = {
      id: makeId("ADDR"),
      ...addressInput,
    };

    setData((current) => {
      const nextAddresses = addressInput.defaultAddress
        ? current.addresses.map((address) => ({
            ...address,
            defaultAddress: false,
          }))
        : current.addresses;

      return {
        ...current,
        addresses: [newAddress, ...nextAddresses],
      };
    });
  }

  function updateAddress(addressId, addressInput) {
    setData((current) => ({
      ...current,
      addresses: current.addresses.map((address) => {
        if (addressInput.defaultAddress && address.id !== addressId) {
          return { ...address, defaultAddress: false };
        }

        if (address.id !== addressId) {
          return address;
        }

        return { ...address, ...addressInput };
      }),
    }));
  }

  function deleteAddress(addressId) {
    setData((current) => {
      const nextAddresses = current.addresses.filter(
        (address) => address.id !== addressId
      );

      if (
        nextAddresses.length > 0 &&
        !nextAddresses.some((address) => address.defaultAddress)
      ) {
        nextAddresses[0] = { ...nextAddresses[0], defaultAddress: true };
      }

      return {
        ...current,
        addresses: nextAddresses,
      };
    });
  }

  function addToCart(productId, options = {}) {
    const product = productsById[productId];

    if (!product) {
      return;
    }

    const size = options.size || product.defaultSize;
    const rentalDates = options.rentalDates || product.rentalDates;

    setData((current) => ({
      ...current,
      cart: [
        {
          id: makeId("CART"),
          productId,
          size,
          rentalDates,
          quantity: 1,
        },
        ...current.cart,
      ],
    }));
  }

  function removeFromCart(cartItemId) {
    setData((current) => ({
      ...current,
      cart: current.cart.filter((item) => item.id !== cartItemId),
    }));
  }

  function updateCartItem(cartItemId, updates) {
    setData((current) => ({
      ...current,
      cart: current.cart.map((item) =>
        item.id === cartItemId ? { ...item, ...updates } : item
      ),
    }));
  }

  function addToWishlist(productId, note = "Saved for later") {
    setData((current) => {
      if (current.wishlist.some((item) => item.productId === productId)) {
        return current;
      }

      return {
        ...current,
        wishlist: [
          { id: makeId("WL"), productId, note },
          ...current.wishlist,
        ],
      };
    });
  }

  function removeFromWishlist(wishlistItemId) {
    setData((current) => ({
      ...current,
      wishlist: current.wishlist.filter((item) => item.id !== wishlistItemId),
    }));
  }

  function moveWishlistToCart(wishlistItemId) {
    const wishlistItem = data.wishlist.find((item) => item.id === wishlistItemId);

    if (!wishlistItem) {
      return;
    }

    addToCart(wishlistItem.productId);
    removeFromWishlist(wishlistItemId);
  }

  function placeOrder({ addressId, paymentMethod, totals }) {
    setData((current) => {
      if (!addressId || current.cart.length === 0) {
        return current;
      }

      const selectedAddress =
        current.addresses.find((address) => address.id === addressId) || null;

      const newOrders = current.cart
        .map((cartItem) => {
          const product = buildPublicCatalogProducts(
            current.products,
            current.publicProducts
          ).find(
            (item) => item.id === cartItem.productId
          );

          if (!product) {
            return null;
          }

          return {
            id: makeOrderId(),
            productId: cartItem.productId,
            rentalDates: cartItem.rentalDates,
            status: "Order placed",
            depositNote: `Rs. ${product.securityDeposit} refundable deposit`,
            action: "View details",
            statusType: "placed",
            size: cartItem.size,
            quantity: cartItem.quantity || 1,
            pricePaid: product.price,
            orderedOn: formatOrderDate(),
            paymentMethod,
            addressId,
            addressSnapshot: selectedAddress,
            totals,
          };
        })
        .filter(Boolean);

      return {
        ...current,
        orders: [...newOrders, ...current.orders],
        cart: [],
      };
    });
  }

  function addVendorListing(listingInput) {
    const parsedPrice = Number(listingInput.rentalPrice) || 0;
    const parsedDeposit = Number(listingInput.securityDeposit) || 0;
    const sizes = listingInput.sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
    const tags = [
      listingInput.category,
      ...(listingInput.availability ? [listingInput.availability] : []),
    ].filter(Boolean);

    const newListing = {
      id: listingInput.id || `LIST-${Date.now().toString().slice(-4)}`,
      name: listingInput.productName,
      category: listingInput.category,
      image: listingInput.image || "/lengha.jpg",
      price: parsedPrice,
      securityDeposit: parsedDeposit,
      availability:
        listingInput.availability || "Freshly added to the rental catalogue",
      status: "Live",
      tags,
      sizes: sizes.length > 0 ? sizes : ["Free Size"],
      description: listingInput.description,
      blockedRanges: [],
      bookedDates: [],
      ownerId: currentUser?.uid || null,
      shopName: profile?.businessName || "Verified Partner Shop",
      businessName: profile?.businessName || "Verified Partner Shop",
      storeLocation: listingInput.storeLocation || "Store location to be updated",
      subscriptionPlan: "Growth",
      onlineCommissionRate: 18,
    };
    const publicProduct = mapVendorListingToProduct(newListing);

    setData((current) => ({
      ...current,
      publicProducts: [
        publicProduct,
        ...current.publicProducts.filter((item) => item.id !== publicProduct.id),
      ],
      vendorListings: [newListing, ...current.vendorListings],
    }));
    savePublicProductToFirestore(publicProduct);
  }

  function updateVendorListing(listingId, listingInput) {
    const parsedPrice = Number(listingInput.rentalPrice) || 0;
    const parsedDeposit = Number(listingInput.securityDeposit) || 0;
    const sizes = listingInput.sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
    const nextTags = [
      listingInput.category,
      ...(listingInput.availability ? [listingInput.availability] : []),
    ].filter(Boolean);

    let nextPublicProduct = null;

    setData((current) => ({
      ...current,
      vendorListings: current.vendorListings.map((listing) => {
        if (listing.id !== listingId) {
          return listing;
        }

        const nextListing = {
          ...listing,
          name: listingInput.productName,
          category: listingInput.category,
          image: listingInput.image || listing.image,
          price: parsedPrice,
          securityDeposit: parsedDeposit,
          availability:
            listingInput.availability || "Freshly updated in the rental catalogue",
          tags: nextTags.length > 0 ? nextTags : listing.tags,
          sizes: sizes.length > 0 ? sizes : listing.sizes,
          description: listingInput.description,
        };
        nextPublicProduct = mapVendorListingToProduct(nextListing);
        return nextListing;
      }),
      publicProducts: current.publicProducts.map((product) =>
        product.id === listingId
          ? nextPublicProduct || product
          : product
      ),
    }));

    if (nextPublicProduct) {
      savePublicProductToFirestore(nextPublicProduct);
    }
  }

  function blockVendorListingDates(listingId, range) {
    if (!range?.from || !range?.to) {
      return;
    }

    setData((current) => ({
      ...current,
      vendorListings: current.vendorListings.map((listing) => {
        if (listing.id !== listingId) {
          return listing;
        }

        const alreadyExists = listing.blockedRanges.some(
          (blockedRange) =>
            blockedRange.from === range.from && blockedRange.to === range.to
        );

        if (alreadyExists) {
          return listing;
        }

        return {
          ...listing,
          blockedRanges: [...listing.blockedRanges, range],
        };
      }),
    }));
  }

  function updateVendorBookingStatus(bookingId, nextStatus) {
    setData((current) => {
      const updatedBookings = current.vendorBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: nextStatus } : booking
      );

      const updatedBooking = updatedBookings.find(
        (booking) => booking.id === bookingId
      );

      if (!updatedBooking) {
        return current;
      }

      const existingReturn = current.vendorReturns.find(
        (item) => item.id === `RET-${bookingId.slice(-3)}`
      );

      let nextReturns = current.vendorReturns;

      if (nextStatus === "Picked Up" && !existingReturn) {
        nextReturns = [
          {
            id: `RET-${bookingId.slice(-3)}`,
            item: updatedBooking.item,
            listingId: updatedBooking.listingId,
            customer: updatedBooking.customer,
            pickup: updatedBooking.to,
            inspection: "Pending quality check",
            deposit: "Hold refundable deposit",
          },
          ...current.vendorReturns,
        ];
      }

      if (nextStatus === "Returned") {
        nextReturns = current.vendorReturns.map((item) =>
          item.listingId === updatedBooking.listingId &&
          item.customer === updatedBooking.customer
            ? {
                ...item,
                inspection: "Approved",
                deposit: "Refund initiated",
              }
            : item
        );
      }

      return {
        ...current,
        vendorBookings: updatedBookings,
        vendorReturns: nextReturns,
      };
    });
  }

  function archiveVendorListing(listingId) {
    setData((current) => ({
      ...current,
      publicProducts: current.publicProducts.filter(
        (product) => product.id !== listingId
      ),
      vendorListings: current.vendorListings.map((listing) =>
        listing.id === listingId ? { ...listing, status: "Archived" } : listing
      ),
    }));
    deletePublicProductFromFirestore(listingId);
  }

  function deleteVendorListing(listingId) {
    setData((current) => ({
      ...current,
      publicProducts: current.publicProducts.filter(
        (product) => product.id !== listingId
      ),
      vendorListings: current.vendorListings.filter(
        (listing) => listing.id !== listingId
      ),
      vendorBookings: current.vendorBookings.filter(
        (booking) => booking.listingId !== listingId
      ),
      vendorReturns: current.vendorReturns.filter(
        (item) => item.listingId !== listingId
      ),
    }));
    deletePublicProductFromFirestore(listingId);
  }

  const vendorListingsWithAvailability = useMemo(
    () =>
      data.vendorListings.map((listing) => ({
        ...listing,
        bookedDates: deriveBookedDatesForListing(data.vendorBookings, listing.id),
      })),
    [data.vendorBookings, data.vendorListings]
  );

  const value = useMemo(
    () => ({
      ...data,
      products: catalogProducts,
      vendorListings: vendorListingsWithAvailability,
      isHydrated,
      addAddress,
      updateAddress,
      deleteAddress,
      addToCart,
      removeFromCart,
      updateCartItem,
      addToWishlist,
      removeFromWishlist,
      moveWishlistToCart,
      placeOrder,
      addVendorListing,
      updateVendorListing,
      blockVendorListingDates,
      updateVendorBookingStatus,
      archiveVendorListing,
      deleteVendorListing,
      getProductById: (productId) => productsById[productId],
      getOrderById: (orderId) => data.orders.find((order) => order.id === orderId),
      getVendorListingById: (listingId) =>
        vendorListingsWithAvailability.find((listing) => listing.id === listingId),
    }),
    [
      catalogProducts,
      data,
      isHydrated,
      productsById,
      vendorListingsWithAvailability,
    ]
  );

  return <AppDataProvider value={value}>{children}</AppDataProvider>;
}
