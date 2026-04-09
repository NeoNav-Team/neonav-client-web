import { Box, Stack, Typography, IconButton } from '@mui/material';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import styles from '../styles/item.module.css';
import { isoDateToDaily, isoDateToMonth } from '@/utilities/fomat';
import SimpleDialog from './simpleDialog';
import { useState, useContext } from 'react';
import { Context as NnContext } from "@/components/context/nnContext";
import { NnProviderValues } from "@/components/context/nnTypes";

interface ItemReviewProps {
  id: string;
  reviewid: string;
  reviewer: string;
  reviewerName: string;
  ts: string;
  rating: number;
  review?: string;
  canDelete?: boolean; // Toggle this based on user permissions
}

export default function ItemReview({
  id,
  reviewid,
  reviewer,
  reviewerName,
  ts,
  rating,
  review,
  canDelete = false,
}: ItemReviewProps): JSX.Element {

  const {
    deleteLocationReview = (reviewid:string) => {},
    fetchLocationById = (id:string) => {},
  }: NnProviderValues = useContext(NnContext);
  const [open, setOpen] = useState(false);

  return (
    <Box style={{ padding: '1vh 0', width: '100%' }}>
      {/* Top Section: User, Rating, and Admin Actions */}
      <div className={styles.statusLine} data-augmented-ui="tr-clip inlay">
        <Box sx={{ p: 1 }}>
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="flex-start">
            <Typography>
              <Link href={`/contacts/${reviewer}`}>
                <span className={styles.name}>{reviewerName} ({reviewer})</span>
              </Link>
              <span className={styles.action}> rated </span>
              <span className={styles.value} style={{ fontWeight: 'bold', color: '#ffea00' }}>
                <StarIcon sx={{ fontSize: 14, verticalAlign: 'middle', mb: 0.5 }} /> {rating.toFixed(1)}
              </span>
            </Typography>

            {canDelete && (
              <IconButton 
                size="small" 
                onClick={() => {
                  setOpen(true);
                }}
                sx={{ color: 'rgba(255,255,255,1)', p: 0 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
            <SimpleDialog 
              open={open}
              handleClose={() => setOpen(false)}
              handleAction={() => {
                deleteLocationReview(reviewid);
                setTimeout(() => {
                  fetchLocationById(id); // Pull latest location data after deleting review
                }, 100);
                setOpen(false);
              }}
              dialog="Are you sure you want to delete this review? This action cannot be undone."
            />
          </Stack>

          {/* Review Text Body */}
          {review && (
            <Typography 
              className={styles.comment} 
              sx={{ mt: 0.5, fontStyle: review ? 'normal' : 'italic', opacity: 0.9 }}
            >
              {review}
            </Typography>
          )}
        </Box>
      </div>

      {/* Bottom Section: Timestamp (Matching ItemStatus style) */}
      <Stack direction="row" spacing={1} alignItems="flex-end" justifyContent="flex-end">
        <Box sx={{ minWidth: '40%', maxWidth: '70%' }}>
          <div className={styles.dateLine} data-augmented-ui="br-clip both">
            <Stack direction="row" spacing={1} justifyContent="center">
              <div className={styles.dateText}>{isoDateToDaily(ts)}</div>
              <div className={styles.dateText}><span>{isoDateToMonth(ts)}</span></div>
            </Stack>
          </div>
        </Box>
      </Stack>
    </Box>
  );
}