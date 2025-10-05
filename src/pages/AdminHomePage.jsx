import React, { useState, useEffect } from 'react';
import {CopyIcon,CheckIcon,TrashIcon } from '../components/Icons';
import { getAllURLs , getDeatiles , deleteUrl} from "../services/Api"

// --- Admin Home Page Component ---
function AdminHomePage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedUrlId, setCopiedUrlId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);

  // Fetches all URLs (for admin view)
  const fetchAllUrls = async () => {
    setLoading(true);
    setError('');
    try {
      // This endpoint should return all URLs if the user is admin
      const response = await getAllURLs();
      if (Array.isArray(response.data.URLS)) {
        setUrls(response.data.URLS);
      } else {
        setError(response?.data?.message ||'Received an unexpected data format from the server.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch URLs. Ensure you are logged in as an admin.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUrls();
  }, []);

  // Handles searching for URLs by a specific user's email
  const handleSearchByUser = async (e) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    setError('');
    try {
        // NOTE: This assumes you have a backend endpoint that accepts anything and returns the URLs. Info
      const response = await getDeatiles(query);
      if (Array.isArray(response.data.URLS)) {
        setUrls(response.data.URLS);
        setQuery("")
      } else {
        setError(response?.data?.message ||'No Deatiles founded or data format is incorrect.');
        setUrls([]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to fetch URLs for ${query}.`;
      setError(errorMessage);
      setUrls([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopy = (shortId) => {
    const fullUrl = `${import.meta.env.VITE_BACKEND_API_URL_COPY}/${shortId}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedUrlId(shortId);
      setTimeout(() => setCopiedUrlId(null), 2000);
    });
  };

  const handleDeleteClick = (shortId) => {
    setUrlToDelete(shortId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!urlToDelete) return;
    try {
      await deleteUrl(urlToDelete);
      // Refetch either all URLs or the searched user's URLs depending on the current view
      if (query) {
        handleSearchByUser(new Event('submit')); // Resubmit the search form
      } else {
        fetchAllUrls();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete URL.');
    } finally {
      setShowDeleteConfirm(false);
      setUrlToDelete(null);
    }
  };

  const handleShortIdClick = (shortId) => {
    window.open(`${import.meta.env.VITE_BACKEND_API_URL_COPY}/${shortId}`, '_blank');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">View and manage all user-created URLs.</p>
          </header>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
            <form onSubmit={handleSearchByUser} className="flex flex-col sm:flex-row gap-4">
              <input id="text" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter user's email to filter" required className="flex-grow w-full rounded-lg border border-gray-700 bg-gray-900 py-3 px-4 text-white placeholder-gray-500 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <button type="submit" disabled={isSearching} className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-transform duration-200 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-blue-800 disabled:opacity-70">
                {isSearching ? 'Searching...' : 'Get Details'}
              </button>
              <button type="button" onClick={fetchAllUrls} className="w-full sm:w-auto rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-gray-700 active:scale-95">
                Show All
              </button>
            </form>
          </div>
          
          {error && <div className="p-4 mb-8 text-center text-red-400 bg-red-500/10 rounded-lg" role="alert">{error}</div>}

          <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {loading && <p className="p-6 text-center text-gray-400">Loading URL data...</p>}
            {!loading && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider">No.</th>
                      <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider">Short ID</th>
                      <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider">Original URL</th>
                      <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider text-center">Clicks</th>
                      <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider">Created By</th>
                      <th className="p-4 font-semibold text-sm text-gray-300 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {urls.length > 0 ? (
                      urls.map((url, index) => (
                        <tr key={url._id} className="hover:bg-gray-700/50 transition-colors">
                          <td className="p-4 text-gray-400">{index + 1}</td>
                          <td onClick={() => handleShortIdClick(url.shortId)} className="p-4 font-medium text-blue-400 cursor-pointer hover:underline">{url.shortId}</td>
                          <td className="p-4 text-gray-300 truncate max-w-xs"><a href={url.OriginalURL} target="_blank" rel="noopener noreferrer" title={url.OriginalURL}>{url.OriginalURL}</a></td>
                          <td className="p-4 text-gray-300 text-center">{url.visitHistory.length}</td>
                          <td className="p-4 text-gray-400 text-sm truncate max-w-[150px]" title={url.createdBy?.email}>{url.createdBy?.email || 'N/A'}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleCopy(url.shortId)} title="Copy link" className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">{copiedUrlId === url.shortId ? <CheckIcon className="text-green-500" /> : <CopyIcon />}</button>
                                <button onClick={() => handleDeleteClick(url.shortId)} title="Delete link" className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"><TrashIcon /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="p-6 text-center text-gray-400">No URLs to display.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-bold text-white mb-2">Confirm Deletion</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this link? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminHomePage;

