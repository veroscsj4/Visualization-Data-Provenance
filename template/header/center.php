<?php

?><header>
  <div class="uk-container uk-background-primary uk-light uk-padding-small">
      <div uk-grid class="uk-flex uk-flex-middle">
        <div class="uk-width-2-3 uk-width-1-4@m logo">
          <a class="uk-display-inline-block" href="#"></a>
        </div>
        <div class="uk-width-1-3 uk-width-3-4@m">
          <nav>
            <ul class="uk-subnav vs-main-menu uk-margin-remove-bottom uk-flex-right uk-visible@m">
              <li>
                <button class="vs-input-file uk-text-center vs-button-icon-secondary"  uk-tooltip="title: View data in table; pos: bottom" id="vs-displayTable"><i class="fal fa-table" id="vs-displayTable" uk-tooltip="title: View data in table; pos: bottom"></i></button>
              </li>
              <li>
                <button class="vs-input-file uk-text-center vs-button-icon-secondary" uk-tooltip="title: View data in graph; pos: bottom" id="vs-displayGraph"><i class="fal fa-project-diagram" id="vs-displayGraph" uk-tooltip="title: View data in graph; pos: bottom" ></i></button>
              </li>
              <!-- <li>
                <button class="vs-input-file uk-text-center vs-button-icon-secondary" uk-tooltip="title: View data in chart pie; pos: bottom" id="vs-displayChart"><i class="far fa-chart-pie" id="vs-displayChart" uk-tooltip="title: View data in chart pie; pos: bottom"></i></button>
              </li>
               <li>
                <button class="vs-input-file uk-text-center vs-button-icon-secondary" uk-tooltip="title: View file; pos: bottom" id="vs-displayFile"><i class="fal fa-file-search" id="vs-displayFile" uk-tooltip="title: View file; pos: bottom"></i></button>
              </li> -->
              <li>
                <form method="post" action="" enctype="multipart/form-data"> <!-- -->
                  <div class="vs-input-file uk-text-center">
                    <p>Search File</p>
                    <input type="file" name="data" id="vs-input-file-button">
                  </div>
                  <div class="vs-input-file uk-text-center">
                    <p>Export</p>
                    <input type="submit" value="Export" for="contentFile" name="button" id="vs-input-file-button">
                  </div>
                </form>
              </li>
            </ul>
            <div class="uk-text-right main-menu-mobile uk-margin-bottom-remove uk-hidden@m">
              <a href="#offcanvas" uk-toggle><span></span></a>
            </div>
          </nav>
        </div>
      </div>
  </div>
</header><?php

// Offcanvas Menu

?>
