<%--
  import user from "./user-partial.md";

  type Args = {
    users: Array<typlate.Args<typeof user>>,
  };
%>

# Employee directory

This is a very big company and we have many employees. Wow, pretty amazing.
Anyway, here they are:

<% for(const user of args.users) { %>
  <%= user({
    name: user.name,
    bio: user.bio,
  }) %>
<% } %>
