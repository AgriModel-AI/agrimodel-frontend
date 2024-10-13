import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Slider from "react-slick";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


// Sample disease data
const diseases = [
  {
    diseaseId: 1,
    name: 'Flu',
    description: 'A viral infection that attacks your respiratory system.',
    symptoms: '<strong>Fever, cough</strong>, sore throat, body aches',
    treatment: '<p>Rest, hydration, <em>antivirals</em></p>',
    prevention: '<ul><li>Vaccination</li><li>Hand washing</li></ul>',
    images: ['https://img.freepik.com/free-photo/people-showing-support-respect-with-yellow-background-suicide-prevention-day_23-2151607937.jpg?t=st=1728759547~exp=1728763147~hmac=6f4846ab7a3a618d83c3c83b11dd7a5b2edb9a63abf756bccff52706c9964fb0&w=740', 'https://img.freepik.com/free-photo/people-showing-support-respect-with-yellow-background-suicide-prevention-day_23-2151607937.jpg?t=st=1728759547~exp=1728763147~hmac=6f4846ab7a3a618d83c3c83b11dd7a5b2edb9a63abf756bccff52706c9964fb0&w=740'],
    relatedDiseases: ['COVID-19', 'Common Cold'],
    createdAt: '2024-01-01',
  },
  {
    diseaseId: 2,
    name: 'COVID-19',
    description: 'A disease caused by the coronavirus SARS-CoV-2.',
    symptoms: 'Fever, cough, shortness of breath',
    treatment: 'Rest, hydration, antiviral medication',
    prevention: 'Masks, social distancing, vaccination',
    images: ['https://img.freepik.com/free-photo/people-showing-support-respect-with-yellow-background-suicide-prevention-day_23-2151607937.jpg?t=st=1728759547~exp=1728763147~hmac=6f4846ab7a3a618d83c3c83b11dd7a5b2edb9a63abf756bccff52706c9964fb0&w=740'],
    relatedDiseases: ['Flu'],
    createdAt: '2024-02-15',
  },
];

const DiseaseTable = () => {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenModal = (disease) => {
    setSelectedDisease(disease);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDisease(null);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    // Perform deletion logic here
    setOpenDeleteDialog(false);
    setOpenModal(false);
    setSelectedDisease(null);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="overline" gutterBottom>
          Disease Management
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ height: '45px', fontSize: 12 }}>
          Create New Disease
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="disease table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Symptoms</strong></TableCell>
              <TableCell><strong>Treatment</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diseases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((disease) => (
              <TableRow key={disease.diseaseId} sx={{padding: 1}}>
                <TableCell>{disease.name}</TableCell>
                <TableCell>{disease.description}</TableCell>
                <TableCell dangerouslySetInnerHTML={{ __html: disease.symptoms }} />
                <TableCell dangerouslySetInnerHTML={{ __html: disease.treatment }} />
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenModal(disease)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="secondary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={diseases.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Modal for Viewing Disease Details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            {selectedDisease && (
              <>
                <Typography variant="h5" gutterBottom>
                  {selectedDisease.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedDisease.description}
                </Typography>

                <Typography variant="body1" fontWeight="bold">
                  Symptoms:
                </Typography>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: selectedDisease.symptoms }} />

                <Typography variant="body1" fontWeight="bold" mt={2}>
                  Treatment:
                </Typography>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: selectedDisease.treatment }} />

                <Typography variant="body1" fontWeight="bold" mt={2}>
                  Prevention:
                </Typography>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: selectedDisease.prevention }} />

                {/* Image Carousel */}
                {selectedDisease.images && selectedDisease.images.length > 0 && (
                  <Box mt={3}>
                    <Slider {...settings}>
                      {selectedDisease.images.map((image, index) => (
                        <Box key={index} sx={{ textAlign: 'center' }}>
                          <img src={image} alt={`Disease Image ${index + 1}`} style={{ maxHeight: '300px', width: 'auto' }} />
                        </Box>
                      ))}
                    </Slider>
                  </Box>
                )}

                {/* Related Diseases */}
                {selectedDisease.relatedDiseases && (
                  <Typography variant="body1" fontWeight="bold" mt={3}>
                    Related Diseases: {selectedDisease.relatedDiseases.join(', ')}
                  </Typography>
                )}

                {/* Management Buttons */}
                <Box mt={4} display="flex" justifyContent="space-between">
                  <Button variant="contained" color="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="contained" color="error" onClick={handleDelete}>
                    Delete
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this disease?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DiseaseTable;
