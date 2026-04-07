import { Box, Stack, Typography, IconButton } from '@mui/material';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import styles from '../styles/item.module.css';
import { isoDateToDaily, isoDateToMonth } from '@/utilities/fomat';

interface ItemReviewProps {
  id: string;
  reviewid: string;
  reviewer: string;
  reviewerName: string;
  ts: string;
  rating: number;
  review?: string;
  isAdmin?: boolean; // Toggle this based on user permissions
  onDelete?: (id:string, reviewid:string) => void; // Callback for the trash icon
}

export default function ItemReview({
  id,
  reviewid,
  reviewer,
  reviewerName,
  ts,
  rating,
  review,
  isAdmin = false,
  onDelete
}: ItemReviewProps): JSX.Element {

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

            {isAdmin && (
              <IconButton 
                size="small" 
                onClick={() => {
                  // do dialog
                  onDelete?.(id, reviewid);
                }}
                sx={{ color: 'rgba(255,255,255,1)', p: 0 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
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