import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon  } from "@heroicons/react/24/solid";

export function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  useEffect(() => {
    fetchLeads();
  }, []);
  // Calculate current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leads.length / itemsPerPage);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.18.146:5000/auth/users/leads-details', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();
      setLeads(Array.isArray(data?.leadsData) ? data.leadsData : []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading leads...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <Typography variant="h6">Error loading leads</Typography>
        <Typography className="text-sm">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between items-center">
            <Typography variant="h6" color="white">
              Leads
            </Typography>
            <Typography variant="small" color="white">
              Page {currentPage} of {totalPages}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
           <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-auto">
           <thead>
  <tr>
    {["Business", "Vendor", "Phone", "Rating", "Category", "Location", "Actions"].map((el) => (
      <th
        key={el}
        className="border-b border-blue-gray-50 py-3 px-5 text-left"
      >
        <Typography
          variant="small"
          className="text-[11px] font-bold uppercase text-blue-gray-400"
        >
          {el}
        </Typography>
      </th>
    ))}
  </tr>
</thead>
            <tbody>
              {currentLeads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Typography variant="h6" color="blue-gray" className="mb-2">
                        No leads found
                      </Typography>
                      <Typography variant="small" color="gray" className="px-4">
                        There are no leads to display at the moment.
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLeads.map((lead, key) => {
                  const className = `py-3 px-5 ${
                    key === leads.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={lead._id || key} className="hover:bg-blue-gray-50/50">
  <td className={className}>
    <div className="flex items-center gap-4">
      <div>
        <Typography
          variant="small"
          color="blue-gray"
          className="font-semibold"
        >
          {lead.storeName || 'Unnamed Business'}
        </Typography>
        <Typography className="text-xs font-normal text-blue-gray-500">
          {lead.category || 'No category'}
        </Typography>
      </div>
    </div>
  </td>
  <td className={className}>
    <Typography className="text-xs font-normal text-blue-gray-600">
      {lead.vendorId || 'No vendor'}
    </Typography>
  </td>
  <td className={className}>
    <Typography className="text-xs font-normal text-blue-gray-600">
      {lead.phone || 'No phone'}
    </Typography>
  </td>
  <td className={className}>
    <div className="flex items-center gap-1">
      <span className="text-yellow-600">★</span>
      <Typography className="text-xs font-semibold">
        {lead.stars || 'N/A'}
      </Typography>
      <Typography className="text-xs text-gray-500">
        ({lead.numberOfReviews || 0} reviews)
      </Typography>
    </div>
  </td>
  <td className={className}>
    <Typography className="text-xs font-semibold text-blue-gray-600">
      {lead.projectCategory || 'N/A'}
    </Typography>
  </td>
  <td className={className}>
    <Typography className="text-xs font-semibold text-blue-gray-600">
      {lead.city || 'N/A'}
    </Typography>
  </td>
  <td className={className}>
    <div className="flex items-center space-x-2">
      {lead.googleUrl && (
        <a 
          href={lead.googleUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline"
        >
          View
        </a>
      )}
      <IconButton 
        variant="text" 
        color="blue-gray" 
        size="sm"
      >
        <PencilIcon className="h-4 w-4" />
      </IconButton>
      <IconButton 
        variant="text" 
        color="red" 
        size="sm"
      >
        <TrashIcon className="h-4 w-4" />
      </IconButton>
    </div>
  </td>
</tr>
                  );
                })
              )}
            </tbody>
          </table>
         {/* Pagination Controls */}
  {leads.length > itemsPerPage && (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-blue-gray-50 gap-4">
      <Typography variant="small" color="blue-gray" className="font-normal">
        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, leads.length)} of {leads.length} entries
      </Typography>
      <div className="flex items-center gap-2">
        <Button
          variant="text"
          color="blue-gray"
          onClick={prevPage}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
          size="sm"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }
            
            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "gradient" : "text"}
                color={currentPage === pageNumber ? "gray" : "blue-gray"}
                onClick={() => paginate(pageNumber)}
                className="w-8 h-8 min-w-[2rem] p-0 flex items-center justify-center"
                size="sm"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="text"
          color="blue-gray"
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
          size="sm"
        >
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )}
  </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Leads;