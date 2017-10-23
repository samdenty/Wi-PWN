package samdd.wipwn;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.sufficientlysecure.donations.DonationsFragment;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import samdd.wipwn.R;

public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {

    //Real device url = http://192.168.4.1
    //Demo url =  wi-pwn.samdd.me
    private static String siteUrl = "http://192.168.4.1";
    //private static String siteUrl = "https://wi-pwn.samdd.me";
    private boolean isConnected = true;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);


        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL(siteUrl);
                    HttpURLConnection urlConnect = (HttpURLConnection) url.openConnection();
                    urlConnect.setConnectTimeout(3000);
                    urlConnect.getContent();
                } catch (NullPointerException np) {
                    isConnected = false;
                    Thread.currentThread().interrupt();
                    return;
                } catch (IOException io) {
                    isConnected = false;
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }).start();

        WebView view = (WebView) this.findViewById(R.id.WebView);
        view.setWebChromeClient(new WebChromeClient());
        if (isConnected = true) {
            view.loadUrl(siteUrl+"/?minimal=true");
        } else {
            view.loadUrl("file:///android_asset/404.html");
        }
        view.getSettings().setJavaScriptEnabled(true);
        view.getSettings().setLoadWithOverviewMode(true);
        view.getSettings().setUseWideViewPort(true);
        navigationView.getMenu().getItem(0).setChecked(true);
        view.setWebViewClient(new WebViewClient() {

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                view.loadUrl("file:///android_asset/404.html");
            }
        });
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_openbrowser) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(siteUrl+"/")));
        }

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_serveraddress) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(siteUrl+"/")));
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        WebView view = (WebView) this.findViewById(R.id.WebView);
        // Handle navigation view item clicks here.
        int id = item.getItemId();
        view.loadUrl(siteUrl+"/?minimal=true");
        if (id == R.id.nav_scan) {
        } else if (id == R.id.nav_users) {
            view.loadUrl(siteUrl+"/users.html");
        } else if (id == R.id.nav_attack) {
            view.loadUrl(siteUrl+"/attack.html");
        } else if (id == R.id.nav_detector) {
            view.loadUrl(siteUrl+"/detector.html");
        } else if (id == R.id.nav_settings) {
            view.loadUrl(siteUrl+"/settings.html");
        } else if (id == R.id.nav_info) {
            view.loadUrl(siteUrl+"/info.html");
        }  else if (id == R.id.nav_donate) {
            startActivity(new Intent(MainActivity.this, DonationsActivity.class));
        } else if (id == R.id.nav_github) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.github.com/samdenty99/Wi-PWN")));
        } else if (id == R.id.nav_discord) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://wi-pwn.samdd.me/discord?ref=app")));
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }
}