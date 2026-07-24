import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";

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

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
  try {

    setLoading(true);

    const res = await getCollections();

    setCollections(res.collections || []);

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Unable to load collections"
    );

  } finally {

    setLoading(false);

  }
};

  const filteredCollections = collections.filter((item) => {

    const query = search.toLowerCase();

    return (
      item.customerName?.toLowerCase().includes(query) ||
      item.accountNumber?.toLowerCase().includes(query)
    );

  });

  const editCollection = (collection) => {
  setSelectedCollection(collection);
  setEditModal(true);
};

  return (
    <Layout>

      <div className="collections-page">

        <div className="page-header">

          <div>

            <h1>Daily Collections</h1>

            <p>Manage customer collections</p>

          </div>

          <button
            className="add-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Collection
          </button>

        </div>

        <CollectionSearch
          value={search}
          onChange={setSearch}
        />

        {loading ? (
          <div className="loading-box">
            <h2>Loading Collections...</h2>
          </div>
        ) : (
          <CollectionTable
            collections={filteredCollections}
          />
        )}

        {showModal && (
          <AddCollection
            closeModal={() => setShowModal(false)}
            refreshCollections={loadCollections}
          />
        )}

              {editModal && selectedCollection && (
          <EditCollection
              collection={selectedCollection}
              closeModal={() => {
                  setEditModal(false);
                  setSelectedCollection(null);
              }}
              refreshCollections={loadCollections}
          />
      )}

      </div>

    </Layout>
  );
};

export default Collections;