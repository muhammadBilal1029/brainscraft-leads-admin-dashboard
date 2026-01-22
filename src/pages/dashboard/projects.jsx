import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.18.146:5000/auth/users/projects-details', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(Array.isArray(data?.projectsData) ? data.projectsData : []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading projects...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <Typography variant="h6">Error loading projects</Typography>
        <Typography className="text-sm">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Projects
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Project", "Vendor", "Category", "Status", "Location", "Created", ""].map((el) => (
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
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Typography variant="h6" color="blue-gray" className="mb-2">
                        No projects found
                      </Typography>
                      <Typography variant="small" color="gray" className="px-4">
                        There are no projects to display at the moment.
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project, key) => {
                  const className = `py-3 px-5 ${
                    key === projects.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={project._id || key}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {project.projectName}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              ID: {project.projectId}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {project.vendorId}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {project.businessCategory}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={
                            project.status === 'Finished' ? 'green' : 
                            project.status === 'In Progress' ? 'blue' : 'gray'
                          }
                          value={project.status}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit capitalize"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {project.city}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex items-center">
                          <IconButton 
                            variant="text" 
                            color="blue-gray" 
                            size="sm"
                            className="mr-2"
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
        </CardBody>
      </Card>
    </div>
  );
}

export default Projects;