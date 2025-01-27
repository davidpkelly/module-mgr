import { createFileRoute} from '@tanstack/react-router'
import MainPage from "../../components/MainPage";

export const Route = createFileRoute('/_auth/main')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <MainPage />
    );
  }