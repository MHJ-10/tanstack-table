import { flexRender, Row, Table } from "@tanstack/react-table";

type PinnedRowProps = {
  row: Row<any>;
  table: Table<any>;
};

const PinnedRow = ({ row, table }: PinnedRowProps) => {
  return (
    <tr
      className={`sticky bg-blue-100 top-${
        row.getIsPinned() === "top"
          ? `${row.getPinnedIndex() * 8 + 48}px`
          : undefined
      } bottom-${
        row.getIsPinned() === "bottom"
          ? `${
              (table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26
            }px`
          : undefined
      }`}
    >
      {row.getVisibleCells().map((cell) => (
        <td className="px-4 pt-[14px] pb-[18px]" key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

export default PinnedRow;
