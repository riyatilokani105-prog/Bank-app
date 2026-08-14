import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";

import { getCollections } from "../../api/collectionApi";

import AddCollection from "./AddCollection";
import CollectionSearch from "./CollectionSearch";
import CollectionTable from "./CollectionTable";
import EditCollection from "./EditCollection";

import "./Collections.css";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // =====================================================
  // GET DATE ONLY
  // =====================================================

  const getDateKey = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  // =====================================================
  // LOAD COLLECTIONS
  // =====================================================

  useEffect(() => {
    loadCollections();

    const refreshCollectionsPage = () => {
      loadCollections();
    };

    window.addEventListener(
      "customerUpdated",
      refreshCollectionsPage
    );

    window.addEventListener(
      "collectionUpdated",
      refreshCollectionsPage
    );

    return () => {
      window.removeEventListener(
        "customerUpdated",
        refreshCollectionsPage
      );

      window.removeEventListener(
        "collectionUpdated",
        refreshCollectionsPage
      );
    };
  }, []);

  // =====================================================
  // GET COLLECTIONS FROM BACKEND
  // =====================================================

  const loadCollections = async () => {
    try {
      setLoading(true);

      const res = await getCollections();

      console.log(
        "COLLECTIONS API RESPONSE:",
        res
      );

      const collectionList = Array.isArray(
        res?.collections
      )
        ? res.collections
        : Array.isArray(res)
        ? res
        : [];

      // =================================================
      // REMOVE INVALID COLLECTIONS
      // =================================================

      const validCollections = collectionList.filter(
        (item) => {
          if (!item?.createdAt) {
            return false;
          }

          const date = new Date(item.createdAt);

          return !Number.isNaN(
            date.getTime()
          );
        }
      );

      // =================================================
      // FIND LATEST AVAILABLE COLLECTION DATE
      // =================================================

      let latestDate = null;

      validCollections.forEach((item) => {
        const collectionDate =
          new Date(item.createdAt);

        if (
          !latestDate ||
          collectionDate > latestDate
        ) {
          latestDate = collectionDate;
        }
      });

      // =================================================
      // FILTER ONLY LATEST DAY COLLECTIONS
      // =================================================

      let latestCollections = [];

      if (latestDate) {
        const latestDateKey =
          getDateKey(latestDate);

        latestCollections =
          validCollections.filter((item) => {
            return (
              getDateKey(item.createdAt) ===
              latestDateKey
            );
          });

        console.log(
          "LATEST COLLECTION DATE:",
          latestDateKey
        );

        console.log(
          "LATEST DAY COLLECTIONS:",
          latestCollections
        );
      }

      // =================================================
      // DEBUG COLLECTIONS
      // =================================================

      latestCollections.forEach(
        (item) => {
          console.log(
            "Account:",
            item.accountNumber,
            "| Customer:",
            item.customerName,
            "| Session:",
            item.session,
            "| Amount:",
            item.amount,
            "| Date:",
            item.createdAt
          );
        }
      );

      setCollections(
        latestCollections
      );
    } catch (err) {
      console.error(
        "GET COLLECTIONS ERROR:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Unable to load collections"
      );

      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCollections = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return collections;
    }

    return collections.filter((item) => {
      const customerName =
        item.customerName
          ?.toLowerCase() || "";

      const accountNumber =
        item.accountNumber
          ?.toString()
          .toLowerCase() || "";

      return (
        customerName.includes(query) ||
        accountNumber.includes(query)
      );
    });
  }, [collections, search]);

  // =====================================================
  // MORNING COLLECTIONS
  // =====================================================

  const morningCollections = useMemo(() => {
    return filteredCollections.filter(
      (item) =>
        item.session === "Morning"
    );
  }, [filteredCollections]);

  // =====================================================
  // EVENING COLLECTIONS
  // =====================================================

  const eveningCollections = useMemo(() => {
    return filteredCollections.filter(
      (item) =>
        item.session === "Evening"
    );
  }, [filteredCollections]);

  // =====================================================
  // GET DISPLAY DATE
  // =====================================================

  const displayDate = useMemo(() => {
    if (!collections.length) {
      return "";
    }

    const latestCollection =
      collections[0];

    if (!latestCollection?.createdAt) {
      return "";
    }

    const date = new Date(
      latestCollection.createdAt
    );

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }, [collections]);

  // =====================================================
  // EDIT COLLECTION
  // =====================================================

  const editCollection = (collection) => {
    setSelectedCollection(collection);
    setEditModal(true);
  };

  // =====================================================
  // RENDER COLLECTION SECTION
  // =====================================================

  const renderCollectionSection = (
    collectionList,
    shiftName
  ) => {
    return (
      <section className="collection-shift-section">

        {/* ============================================
            SHIFT HEADER
        ============================================ */}

        <div
          className={`collection-shift-header ${
            shiftName === "Morning"
              ? "collection-morning-header"
              : "collection-evening-header"
          }`}
        >
          <div>
            <h2>
              {shiftName === "Morning"
                ? "🌅 Morning Collections"
                : "🌇 Evening Collections"}
            </h2>

            <p>
              {displayDate
                ? `Collections for ${displayDate}`
                : `No ${shiftName} collections available`}
            </p>
          </div>

          <span className="collection-count">
            {collectionList.length}
          </span>
        </div>

        {/* ============================================
            TABLE
        ============================================ */}

        {collectionList.length === 0 ? (
          <div className="collection-empty-row">
            No {shiftName} Collections Found
          </div>
        ) : (
          <CollectionTable
            collections={collectionList}
          />
        )}
      </section>
    );
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <Layout>
      <div className="collections-page">

        {/* ============================================
            HEADER
        ============================================ */}

        <div className="page-header">

          <div>
            <h1>
              Daily Collections
            </h1>

            <p>
              {displayDate
                ? `Showing latest collection day: ${displayDate}`
                : "No collections available"}
            </p>
          </div>

          <button
            type="button"
            className="add-btn"
            onClick={() =>
              setShowModal(true)
            }
          >
            + Add Collection
          </button>

        </div>

        {/* ============================================
            SEARCH
        ============================================ */}

        <CollectionSearch
          value={search}
          onChange={setSearch}
        />

        {/* ============================================
            LOADING
        ============================================ */}

        {loading ? (
          <div className="loading-box">
            <h2>
              Loading Collections...
            </h2>
          </div>
        ) : (
          <>
            {/* ========================================
                MORNING COLLECTIONS
            ======================================== */}

            {renderCollectionSection(
              morningCollections,
              "Morning"
            )}

            {/* ========================================
                EVENING COLLECTIONS
            ======================================== */}

            {renderCollectionSection(
              eveningCollections,
              "Evening"
            )}
          </>
        )}

        {/* ============================================
            ADD COLLECTION MODAL
        ============================================ */}

        {showModal && (
          <AddCollection
            closeModal={() =>
              setShowModal(false)
            }
            refreshCollections={
              loadCollections
            }
          />
        )}

        {/* ============================================
            EDIT COLLECTION MODAL
        ============================================ */}

        {editModal &&
          selectedCollection && (
            <EditCollection
              collection={
                selectedCollection
              }

              closeModal={() => {
                setEditModal(false);
                setSelectedCollection(null);
              }}

              refreshCollections={
                loadCollections
              }
            />
          )}

      </div>
    </Layout>
  );
};

export default Collections;