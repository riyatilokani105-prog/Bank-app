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

    return () => {
      window.removeEventListener(
        "customerUpdated",
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
      // DEBUG COLLECTION SHIFTS
      // =================================================

      console.log(
        "ALL COLLECTION SHIFTS:"
      );

      collectionList.forEach((item) => {
       collectionList.forEach((item) => {
  console.log(
    "Account:",
    item.accountNumber,
    "| Customer:",
    item.customerName,
    "| Session:",
    item.session
  );
});
      });

      setCollections(collectionList);
    } catch (err) {
      console.error(
        "GET COLLECTIONS ERROR:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to load collections"
      );
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
  return filteredCollections.filter((item) => {
    return item.session === "Morning";
  });
}, [filteredCollections]);

  // =====================================================
  // EVENING COLLECTIONS
  // =====================================================

  const eveningCollections = useMemo(() => {
  return filteredCollections.filter((item) => {
    return item.session === "Evening";
  });
}, [filteredCollections]);
  // =====================================================
  // EDIT COLLECTION
  // =====================================================

  const editCollection = (collection) => {
    setSelectedCollection(collection);
    setEditModal(true);
  };

  // =====================================================
  // RENDER COLLECTION TABLE
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
              Collections assigned to{" "}
              {shiftName} shift
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
            <h1>Daily Collections</h1>

            <p>
              Manage Morning and Evening
              customer collections
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