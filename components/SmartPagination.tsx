import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export default function SmartPagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages);

  const scrollToElement = () => {
    const container = document.getElementById("articles");
    container?.scrollIntoView({ behavior: "instant" });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              setCurrentPage(currentPage - 1);
              scrollToElement();
            }}
            disabled={currentPage === 1 || currentPage === 0}
          />
        </PaginationItem>

        {pages.map((page, index) =>
          page === "start-ellipsis" || page === "end-ellipsis" ? (
            <PaginationItem key={page + index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => {
                  setCurrentPage(page);
                  scrollToElement();
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              setCurrentPage(currentPage + 1);
              scrollToElement();
            }}
            disabled={currentPage === totalPages || totalPages === 0}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function getVisiblePages(current: number, total: number): (number | "start-ellipsis" | "end-ellipsis")[] {
  const pages: (number | "start-ellipsis" | "end-ellipsis")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);

    if (current > 4) pages.push("start-ellipsis");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push("end-ellipsis");

    pages.push(total);
  }

  return pages;
}
