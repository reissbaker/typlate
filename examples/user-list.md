<%--
  import userPartial from "./user-partial.md";

  type Args = {
    users: Array<TyplateArgs<typeof userPartial>>,
  };
%>

# Employee directory

This is a very big company and we have many employees. Wow, pretty amazing.
Anyway, here they are:

<% for(const user of args.users) { %>
  <%= userPartial({
    name: user.name,
    bio: user.bio,
    employedSince: user.employedSince,
  }) %>
<% } %>
