import { Box, Typography, Avatar, Stack } from "@mui/material";
import styles from "../styles/item.module.css";
import { PersonAdd } from "@mui/icons-material";
import { NnProviderValues } from "./context/nnTypes";
import { Context as NnContext } from "./context/nnContext";
import { useContext } from "react";
import Link from "next/link";

interface subheaderEntityProps {
  id?: string;
  title?: string;
  cover?: string;
  photo?: string;
}

export default function SubheaderEntity(
  props: subheaderEntityProps
): JSX.Element {
  const { photo, cover, title, id } = props;
  const {
    state,
    befriend = (id: string) => {},
    fetchContact = (id: string) => {},
    unfriend = (id: string) => {},
    addRecentScan = (entity: any) => {},
    fetchUserContacts = () => {},
  }: NnProviderValues = useContext(NnContext);

  return (
    <div className={styles.subtitleLine} data-augmented-ui="tr-clip both">
      <Box sx={{ background: cover }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Avatar
              src={photo}
              variant="rounded"
              sx={{
                width: { xs: 60, md: 100, xl: 150 },
                height: { xs: 60, md: 100, xl: 150 },
              }}
            />
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: 24, md: 32, xl: 64 } }}
            >
              {title}
            </Typography>
          </Stack>
          {id && (
            <Link href={`/contacts/${id}`}>
              <PersonAdd />
            </Link>
          )}
        </Stack>
      </Box>
    </div>
  );
}
