export const ApplicationDescriptionMembersTable = ({ children }) => {
  return (
    <>
      <table className="details-table">
        <thead className="details-table-thead">
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      <style>{`
          .details-table-thead tr th {
            text-align: left;
            font-weight: 400;
          }
  
          .action-role {
            float: left;
          }

          .action-remove {
            float: right;
          }
        `}</style>
    </>
  );
};
