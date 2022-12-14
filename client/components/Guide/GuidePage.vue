<template>
  <article class="guide">
    <section class="inner">
      <h2>Guide Page</h2>
      <section style="text-align: justify">
        <h3>Neighborhood</h3>
        <p>
          <i>Participate</i> centers around the idea of a neighborhood, which corresponds to a neighborhood in Cambridge. During creation of an account, you pick the neighborhood you are affiliated with.
        </p>
        <p>
          Each neighborhood has its own special page, accessible from the navigation bar. On your neighborhood’s page, you can post your thoughts under the Forum section. Only members of your neighborhood would be able to upvote your post or comment on it. Other Cambridge citizens can simply view.
        </p>

        <p>
          On your neighborhood page, you can also set up a petition under Petitions. This is a formidable way to raise issues among people in your own neighborhood and make the City Council aware of these issues, as well as call for action. Similar to Forum posts, only members of your neighborhood would be able to sign your petition. When you reach your target number of signatures, the petition is sent to the City Council, where it can be accepted or denied by a city counsel member. You will be able to view the City Council’s decision on your petition. Any petition created in your neighborhood can be attached to your neighborhood forum post. 
        </p>

        <p>
          In the event that people prefer to face each other off and voice their opinions about a petition, you can schedule a Round Table on a petition you have created. As such, members of your neighborhood can make an informed decision on whether they choose to sign the petition or not based on the conversations had during the Round Table.
        </p>
        <h3>City</h3>
        <p>
          We live in an interconnected world. In the likelihood that there is a matter that concerns multiple neighborhoods, you can create a petition on the City’s page instead of your neighborhood page. Doing this allows members from all neighborhoods to sign your petition. The City’s page also contains a Forum and Round Table page, which members from all neighborhoods can participate in.
        </p>
      </section>
    </section>
  </article>
</template>
  
  <script>
 
  
  export default {
     name: 'GuidePage',
      components: {
        
      },
      props: {
  
      },
      data() {
          return {

          }
      },
      mounted(){

      },
    }
  
  </script>
  
  
  <style scoped>
.guide {
    display: flex;
    font-family: Arial, Helvetica, sans-serif;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%
}

.inner {
    width:60%;
    background-color: #BEDEDC;
  color: rgb(0, 0, 0);
  padding: 30px;
  border-radius: 5px;
}

h2 {
    text-align: center;
    color: rgb(170, 85, 64);
}

h3 {
    color: rgb(170, 85, 64);
}
  </style>
  