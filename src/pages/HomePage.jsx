import React, { useState, useEffect } from 'react';
import {CopyIcon,CheckIcon,TrashIcon } from '../components/Icons';
import {getUrlsCreatedByUser,createShortUrl,deleteUrl} from '../services/Api'
// --- Admin Home Page Component ---
function HomePage() {
  const [newUrl, setNewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastCreatedUrl, setLastCreatedUrl] = useState(null);
  const [copiedUrlId, setCopiedUrlId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      setError('');
      // Assuming admins see all URLs, this endpoint remains correct
      const response = await getUrlsCreatedByUser();
      if (Array.isArray(response.data.URLS)) {
        setUrls(response.data.URLS);
      } else {
        setError('Received an unexpected data format from the server.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch URLs. Please make sure you are logged in.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShortenUrl = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setLastCreatedUrl(null);
    try { 
      const response = await createShortUrl(newUrl);
      // The response for a new URL is the URL object itself
      setLastCreatedUrl(response.data.URLS);
      setNewUrl('');
      // Refresh the list to include the new URL
      fetchUrls(); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to shorten URL.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
      
      fetchUrls();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete URL.');
    } finally {
      setShowDeleteConfirm(false);
      setUrlToDelete(null);
    }
  };

  const handleShortIdClick = (shortId) => {
    window.open(`${import.meta.env.VITE_BACKEND_API_URL_COPY}/${shortId}`, '_blank');
    setTimeout(() => { fetchUrls(); }, 500);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">URL Management</h1>
            <p className="text-gray-400">Create new links and manage all user URLs.</p>
          </header>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
            <form onSubmit={handleShortenUrl} className="flex flex-col sm:flex-row gap-4">
              <input id="longUrl" type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://enter-a-new-long-url-here.com" required className="flex-grow w-full rounded-lg border border-gray-700 bg-gray-900 py-3 px-4 text-white placeholder-gray-500 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-transform duration-200 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-blue-800 disabled:opacity-70">
                {isSubmitting ? 'Shortening...' : 'Shorten URL'}
              </button>
            </form>
          </div>

          {lastCreatedUrl && (
            <div className="bg-green-900/50 border border-green-500/30 p-4 rounded-2xl shadow-lg mb-8">
              <div>
                  <p className="text-sm text-green-300">Successfully created!</p>
                  <a href={`${import.meta.env.VITE_BACKEND_API_URL_COPY}/${lastCreatedUrl.shortId}`} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-white hover:underline break-all">
                      {`${import.meta.env.VITE_BACKEND_API_URL_COPY}/${lastCreatedUrl.shortId}`}
                  </a>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <button onClick={() => handleCopy(lastCreatedUrl.shortId)} className="cursor-pointer flex w-1/2 items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 text-sm font-semibold">
                    {copiedUrlId === lastCreatedUrl.shortId ? <CheckIcon className="h-5 w-5 text-green-400"/> : <CopyIcon className="h-5 w-5"/>}
                    {copiedUrlId === lastCreatedUrl.shortId ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={() => handleDeleteClick(lastCreatedUrl.shortId)} className="cursor-pointer flex w-1/2 items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-900/50 hover:bg-red-900/80 transition-colors text-red-400 text-sm font-semibold">
                    <TrashIcon className="h-5 w-5" />
                    Delete
                </button>
              </div>
            </div>
          )}
          
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
                                <button onClick={() => handleCopy(url.shortId)} title="Copy link" className="cursor-pointer p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">{copiedUrlId === url.shortId ? <CheckIcon className="text-green-500" /> : <CopyIcon />}</button>
                                <button onClick={() => handleDeleteClick(url.shortId)} title="Delete link" className="cursor-pointer p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"><TrashIcon /></button>
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

export default HomePage;

